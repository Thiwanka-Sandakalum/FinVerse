package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/finverse/interaction-service/config"
	"github.com/finverse/interaction-service/repositories"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/sirupsen/logrus"
)

// RabbitMQClient handles RabbitMQ connection and operations
type RabbitMQClient struct {
	conn            *amqp.Connection
	channel         *amqp.Channel
	cfg             *config.RabbitMQConfig
	logger          *logrus.Logger
	repo            *repositories.MongoRepository
	notifyConnClose chan *amqp.Error
	notifyChanClose chan *amqp.Error
	isConnected     bool
}

// NewRabbitMQClient creates a new RabbitMQ client
func NewRabbitMQClient(cfg *config.Config, logger *logrus.Logger, repo *repositories.MongoRepository) (*RabbitMQClient, error) {
	client := &RabbitMQClient{
		cfg:    &cfg.RabbitMQ,
		logger: logger,
		repo:   repo,
	}

	// Connect to RabbitMQ
	if err := client.connect(); err != nil {
		return nil, err
	}

	return client, nil
}

// connect establishes a connection to RabbitMQ and sets up channels and exchanges
func (c *RabbitMQClient) connect() error {
	var err error

	c.conn, err = amqp.Dial(c.cfg.URI)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	c.channel, err = c.conn.Channel()
	if err != nil {
		c.conn.Close()
		return fmt.Errorf("failed to open a channel: %w", err)
	}

	// Declare exchange
	err = c.channel.ExchangeDeclare(
		c.cfg.ExchangeName, // name
		c.cfg.ExchangeType, // type
		true,               // durable
		false,              // auto-deleted
		false,              // internal
		false,              // no-wait
		nil,                // arguments
	)
	if err != nil {
		c.channel.Close()
		c.conn.Close()
		return fmt.Errorf("failed to declare an exchange: %w", err)
	}

	// Declare queues
	queues := []string{
		c.cfg.InteractionQueue,
		c.cfg.ProductViewQueue,
		c.cfg.ComparisonQueue,
		c.cfg.SearchQueue,
	}

	for _, qName := range queues {
		_, err = c.channel.QueueDeclare(
			qName, // name
			true,  // durable
			false, // delete when unused
			false, // exclusive
			false, // no-wait
			nil,   // arguments
		)
		if err != nil {
			c.channel.Close()
			c.conn.Close()
			return fmt.Errorf("failed to declare queue %s: %w", qName, err)
		}

		// Bind queue to exchange with routing key
		err = c.channel.QueueBind(
			qName,              // queue name
			qName,              // routing key
			c.cfg.ExchangeName, // exchange
			false,
			nil,
		)
		if err != nil {
			c.channel.Close()
			c.conn.Close()
			return fmt.Errorf("failed to bind queue %s: %w", qName, err)
		}
	}

	// Setup notification channels for connection and channel close
	c.notifyConnClose = make(chan *amqp.Error)
	c.notifyChanClose = make(chan *amqp.Error)

	c.conn.NotifyClose(c.notifyConnClose)
	c.channel.NotifyClose(c.notifyChanClose)

	c.isConnected = true

	// Start a goroutine to handle reconnection
	go c.handleReconnect()

	return nil
}

// handleReconnect handles reconnection to RabbitMQ if the connection is lost
func (c *RabbitMQClient) handleReconnect() {
	for {
		select {
		case err := <-c.notifyConnClose:
			c.isConnected = false
			c.logger.Errorf("RabbitMQ connection closed: %v", err)

			// Try to reconnect
			for i := 0; i < c.cfg.ReconnectAttempts; i++ {
				c.logger.Infof("Attempting to reconnect to RabbitMQ (%d/%d)...", i+1, c.cfg.ReconnectAttempts)

				if err := c.connect(); err != nil {
					c.logger.Errorf("Failed to reconnect to RabbitMQ: %v", err)
					time.Sleep(time.Duration(c.cfg.ReconnectDelay) * time.Second)
					continue
				}

				c.logger.Info("Successfully reconnected to RabbitMQ")
				return
			}

			c.logger.Fatal("Failed to reconnect to RabbitMQ after multiple attempts")
			return

		case err := <-c.notifyChanClose:
			c.isConnected = false
			c.logger.Errorf("RabbitMQ channel closed: %v", err)

			// Try to reconnect
			for i := 0; i < c.cfg.ReconnectAttempts; i++ {
				c.logger.Infof("Attempting to reopen RabbitMQ channel (%d/%d)...", i+1, c.cfg.ReconnectAttempts)

				var err error
				c.channel, err = c.conn.Channel()
				if err != nil {
					c.logger.Errorf("Failed to reopen RabbitMQ channel: %v", err)
					time.Sleep(time.Duration(c.cfg.ReconnectDelay) * time.Second)
					continue
				}

				c.notifyChanClose = make(chan *amqp.Error)
				c.channel.NotifyClose(c.notifyChanClose)
				c.isConnected = true

				c.logger.Info("Successfully reopened RabbitMQ channel")
				return
			}

			c.logger.Fatal("Failed to reopen RabbitMQ channel after multiple attempts")
			return
		}
	}
}

// Close closes the RabbitMQ connection and channel
func (c *RabbitMQClient) Close() error {
	if !c.isConnected {
		return nil
	}

	if err := c.channel.Close(); err != nil {
		return fmt.Errorf("failed to close RabbitMQ channel: %w", err)
	}

	if err := c.conn.Close(); err != nil {
		return fmt.Errorf("failed to close RabbitMQ connection: %w", err)
	}

	c.isConnected = false
	return nil
}

// PublishEvent publishes an event to RabbitMQ
func (c *RabbitMQClient) PublishEvent(ctx context.Context, routingKey string, event interface{}) error {
	if !c.isConnected {
		return fmt.Errorf("not connected to RabbitMQ")
	}

	data, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal event: %w", err)
	}

	// Use context with timeout for publishing
	publishCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	err = c.channel.PublishWithContext(
		publishCtx,
		c.cfg.ExchangeName, // exchange
		routingKey,         // routing key
		false,              // mandatory
		false,              // immediate
		amqp.Publishing{
			ContentType:  "application/json",
			DeliveryMode: amqp.Persistent, // Make message persistent
			Timestamp:    time.Now(),
			Body:         data,
		},
	)

	if err != nil {
		return fmt.Errorf("failed to publish event: %w", err)
	}

	return nil
}

// ConsumeEvents starts consuming events from specified queues
func (c *RabbitMQClient) ConsumeEvents(ctx context.Context) error {
	if !c.isConnected {
		return fmt.Errorf("not connected to RabbitMQ")
	}

	queues := map[string]repositories.EventType{
		c.cfg.InteractionQueue: repositories.InteractionEvent,
		c.cfg.ProductViewQueue: repositories.ProductViewEvent,
		c.cfg.ComparisonQueue:  repositories.ComparisonEvent,
		c.cfg.SearchQueue:      repositories.SearchEvent,
	}

	for queueName, eventType := range queues {
		msgs, err := c.channel.Consume(
			queueName, // queue
			"",        // consumer
			false,     // auto-ack
			false,     // exclusive
			false,     // no-local
			false,     // no-wait
			nil,       // args
		)
		if err != nil {
			return fmt.Errorf("failed to consume from queue %s: %w", queueName, err)
		}

		// Start goroutine to consume messages
		go c.processMessages(ctx, msgs, eventType)
	}

	return nil
}

// processMessages processes messages from a RabbitMQ queue
func (c *RabbitMQClient) processMessages(ctx context.Context, msgs <-chan amqp.Delivery, eventType repositories.EventType) {
	for {
		select {
		case <-ctx.Done():
			c.logger.Infof("Stopping consumer for event type: %s", eventType)
			return
		case msg, ok := <-msgs:
			if !ok {
				c.logger.Warnf("Channel closed for event type: %s", eventType)
				return
			}

			// Process the message
			err := c.handleMessage(ctx, msg, eventType)
			if err != nil {
				c.logger.Errorf("Failed to process message: %v", err)
				// Nack the message to requeue
				if err := msg.Nack(false, true); err != nil {
					c.logger.Errorf("Failed to nack message: %v", err)
				}
			} else {
				// Acknowledge the message
				if err := msg.Ack(false); err != nil {
					c.logger.Errorf("Failed to ack message: %v", err)
				}
			}
		}
	}
}

// handleMessage processes a single message
func (c *RabbitMQClient) handleMessage(ctx context.Context, msg amqp.Delivery, eventType repositories.EventType) error {
	var data interface{}
	if err := json.Unmarshal(msg.Body, &data); err != nil {
		return fmt.Errorf("failed to unmarshal message: %w", err)
	}

	// Create an event
	event := &repositories.Event{
		Type:      eventType,
		Timestamp: time.Now().UTC(),
		Data:      data,
	}

	// Extract UserID and SessionID if present in the data
	if dataMap, ok := data.(map[string]interface{}); ok {
		if userID, ok := dataMap["userId"].(string); ok && userID != "" {
			event.UserID = &userID
		}
		if sessionID, ok := dataMap["sessionId"].(string); ok && sessionID != "" {
			event.SessionID = &sessionID
		}
	}

	// Insert the event into MongoDB
	_, err := c.repo.InsertEvent(ctx, event)
	if err != nil {
		return fmt.Errorf("failed to insert event: %w", err)
	}

	c.logger.Infof("Processed %s event", eventType)
	return nil
}
