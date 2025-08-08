package services

import (
	"context"
	"fmt"

	"github.com/finverse/interaction-service/repositories"
	"github.com/sirupsen/logrus"
)

// InteractionService handles interaction tracking
type InteractionService struct {
	repo   *repositories.MongoRepository
	rabbit *RabbitMQClient
	logger *logrus.Logger
}

// NewInteractionService creates a new interaction service
func NewInteractionService(repo *repositories.MongoRepository, rabbit *RabbitMQClient, logger *logrus.Logger) *InteractionService {
	return &InteractionService{
		repo:   repo,
		rabbit: rabbit,
		logger: logger,
	}
}

// TrackInteraction tracks a generic interaction event
func (s *InteractionService) TrackInteraction(ctx context.Context, event interface{}) error {
	return s.rabbit.PublishEvent(ctx, "interactions", event)
}

// TrackProductView tracks a product view event
func (s *InteractionService) TrackProductView(ctx context.Context, event interface{}) error {
	return s.rabbit.PublishEvent(ctx, "product_views", event)
}

// TrackComparison tracks a comparison event
func (s *InteractionService) TrackComparison(ctx context.Context, event interface{}) error {
	return s.rabbit.PublishEvent(ctx, "comparisons", event)
}

// TrackSearch tracks a search event
func (s *InteractionService) TrackSearch(ctx context.Context, event interface{}) error {
	return s.rabbit.PublishEvent(ctx, "searches", event)
}

// GetUserInteractions retrieves interactions for a specific user
func (s *InteractionService) GetUserInteractions(ctx context.Context, userID string, limit int64, skip int64) ([]*repositories.Event, error) {
	if userID == "" {
		return nil, fmt.Errorf("user ID is required")
	}

	return s.repo.FindEventsByUser(ctx, userID, limit, skip)
}

// GetSessionInteractions retrieves interactions for a specific session
func (s *InteractionService) GetSessionInteractions(ctx context.Context, sessionID string, limit int64, skip int64) ([]*repositories.Event, error) {
	if sessionID == "" {
		return nil, fmt.Errorf("session ID is required")
	}

	return s.repo.FindEventsBySession(ctx, sessionID, limit, skip)
}

// GetProductInteractions retrieves interactions for a specific product
func (s *InteractionService) GetProductInteractions(ctx context.Context, productID string, limit int64, skip int64) ([]*repositories.Event, error) {
	if productID == "" {
		return nil, fmt.Errorf("product ID is required")
	}

	return s.repo.FindEventsByProduct(ctx, productID, limit, skip)
}

// GetEventsByType retrieves events of a specific type
func (s *InteractionService) GetEventsByType(ctx context.Context, eventType repositories.EventType, limit int64, skip int64) ([]*repositories.Event, error) {
	return s.repo.FindEventsByType(ctx, eventType, limit, skip)
}

// GetMostViewedProducts retrieves the most viewed products
func (s *InteractionService) GetMostViewedProducts(ctx context.Context, limit int64) ([]map[string]interface{}, error) {
	return s.repo.GetMostViewedProducts(ctx, limit)
}

// GetInteractionStats retrieves interaction statistics
func (s *InteractionService) GetInteractionStats(ctx context.Context) (map[string]interface{}, error) {
	return s.repo.GetInteractionStats(ctx)
}
