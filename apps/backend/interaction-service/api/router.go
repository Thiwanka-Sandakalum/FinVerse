package api

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// SetupRouter configures the API router
func SetupRouter(handler *Handler, logger *logrus.Logger) *gin.Engine {
	// Set Gin mode based on environment
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()

	// Middleware
	router.Use(gin.Recovery())
	router.Use(loggerMiddleware(logger))

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", handler.HealthCheck)

	// API endpoints
	api := router.Group("/api/v1")
	{
		// Track interactions
		api.POST("/interactions", handler.TrackInteraction)
		api.POST("/product-views", handler.TrackProductView)
		api.POST("/comparisons", handler.TrackComparison)
		api.POST("/searches", handler.TrackSearch)

		// Get interactions
		api.GET("/interactions/user/:userId", handler.GetUserInteractions)
		api.GET("/interactions/session/:sessionId", handler.GetSessionInteractions)
		api.GET("/interactions/product/:productId", handler.GetProductInteractions)

		// Analytics
		api.GET("/product-views/most-viewed", handler.GetMostViewedProducts)
		api.GET("/interactions/stats", handler.GetInteractionStats)
	}

	return router
}

// loggerMiddleware logs HTTP requests
func loggerMiddleware(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Log request details
		latency := time.Since(start)
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method
		path := c.Request.URL.Path

		// Color-coded status code for console output
		fields := logrus.Fields{
			"status":     statusCode,
			"latency":    latency,
			"client_ip":  clientIP,
			"method":     method,
			"path":       path,
			"request_id": c.Writer.Header().Get("Request-ID"),
		}

		if len(c.Errors) > 0 {
			logger.WithFields(fields).Error(c.Errors.String())
		} else {
			if statusCode >= 500 {
				logger.WithFields(fields).Error("Server error")
			} else if statusCode >= 400 {
				logger.WithFields(fields).Warn("Client error")
			} else {
				logger.WithFields(fields).Info("Request processed")
			}
		}
	}
}
