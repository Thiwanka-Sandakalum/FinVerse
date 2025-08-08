package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/finverse/interaction-service/api"
	"github.com/finverse/interaction-service/config"
	"github.com/finverse/interaction-service/repositories"
	"github.com/finverse/interaction-service/services"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Error loading config: %v\n", err)
		os.Exit(1)
	}

	// Setup logger
	logger := config.SetupLogger(&cfg.Logging)

	logger.Info("Starting Interaction Service...")
	logger.Infof("Config loaded: server port %d, MongoDB URI %s", cfg.Server.Port, cfg.MongoDB.URI)

	// Connect to MongoDB
	repo, err := repositories.NewMongoRepository(cfg)
	if err != nil {
		logger.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Create context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Connect to RabbitMQ
	rabbitClient, err := services.NewRabbitMQClient(cfg, logger, repo)
	if err != nil {
		logger.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer func() {
		if err := rabbitClient.Close(); err != nil {
			logger.Errorf("Error closing RabbitMQ connection: %v", err)
		}
	}()

	// Start consuming messages
	if err := rabbitClient.ConsumeEvents(ctx); err != nil {
		logger.Fatalf("Failed to start consuming events: %v", err)
	}

	// Create services
	interactionService := services.NewInteractionService(repo, rabbitClient, logger)

	// Set up HTTP server
	handler := api.NewHandler(interactionService, logger)
	router := api.SetupRouter(handler, logger)

	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  time.Duration(cfg.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Server.WriteTimeout) * time.Second,
		IdleTimeout:  time.Duration(cfg.Server.IdleTimeout) * time.Second,
	}

	// Start server in a goroutine
	go func() {
		logger.Infof("HTTP server listening on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Block until we receive a signal
	sig := <-quit
	logger.Infof("Received signal: %v, shutting down server...", sig)

	// Create a deadline for graceful shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer shutdownCancel()

	// Trigger graceful shutdown
	cancel() // Cancel the context to stop RabbitMQ consumers

	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Fatalf("Server shutdown failed: %v", err)
	}

	// Close MongoDB connection
	mongoCtx, mongoCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer mongoCancel()

	if err := repo.Close(mongoCtx); err != nil {
		logger.Errorf("Error closing MongoDB connection: %v", err)
	}

	logger.Info("Server gracefully stopped")
}
