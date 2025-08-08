package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/finverse/interaction-service/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// EventType represents the type of interaction event
type EventType string

const (
	InteractionEvent EventType = "interaction"
	ProductViewEvent EventType = "product_view"
	ComparisonEvent  EventType = "comparison"
	SearchEvent      EventType = "search"
	ApplicationEvent EventType = "application"
	PreferenceEvent  EventType = "preference"
)

// Event represents a generic interaction event
type Event struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Type      EventType          `bson:"type" json:"type"`
	UserID    *string            `bson:"user_id,omitempty" json:"userId,omitempty"`
	SessionID *string            `bson:"session_id,omitempty" json:"sessionId,omitempty"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
	Data      interface{}        `bson:"data" json:"data"`
}

// MongoRepository handles MongoDB operations for interaction events
type MongoRepository struct {
	client     *mongo.Client
	db         *mongo.Database
	collection *mongo.Collection
}

// NewMongoRepository creates a new MongoDB repository
func NewMongoRepository(cfg *config.Config) (*MongoRepository, error) {
	clientOptions := options.Client().ApplyURI(cfg.MongoDB.URI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Check the connection
	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	db := client.Database(cfg.MongoDB.Database)
	collection := db.Collection(cfg.MongoDB.Collection)

	// Create indexes for common query patterns
	indexes := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "user_id", Value: 1}, {Key: "timestamp", Value: -1}},
			Options: options.Index().SetBackground(true),
		},
		{
			Keys:    bson.D{{Key: "session_id", Value: 1}, {Key: "timestamp", Value: -1}},
			Options: options.Index().SetBackground(true),
		},
		{
			Keys:    bson.D{{Key: "data.productId", Value: 1}, {Key: "timestamp", Value: -1}},
			Options: options.Index().SetBackground(true),
		},
		{
			Keys:    bson.D{{Key: "type", Value: 1}, {Key: "timestamp", Value: -1}},
			Options: options.Index().SetBackground(true),
		},
	}

	_, err = collection.Indexes().CreateMany(ctx, indexes)
	if err != nil {
		return nil, fmt.Errorf("failed to create indexes: %w", err)
	}

	return &MongoRepository{
		client:     client,
		db:         db,
		collection: collection,
	}, nil
}

// Close closes the MongoDB connection
func (r *MongoRepository) Close(ctx context.Context) error {
	return r.client.Disconnect(ctx)
}

// InsertEvent inserts an interaction event into MongoDB
func (r *MongoRepository) InsertEvent(ctx context.Context, event *Event) (*Event, error) {
	if event.Timestamp.IsZero() {
		event.Timestamp = time.Now().UTC()
	}

	result, err := r.collection.InsertOne(ctx, event)
	if err != nil {
		return nil, fmt.Errorf("failed to insert event: %w", err)
	}

	event.ID = result.InsertedID.(primitive.ObjectID)
	return event, nil
}

// FindEventsByUser finds events by user ID with pagination
func (r *MongoRepository) FindEventsByUser(ctx context.Context, userID string, limit int64, skip int64) ([]*Event, error) {
	filter := bson.M{"user_id": userID}
	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "timestamp", Value: -1}})

	return r.findEvents(ctx, filter, opts)
}

// FindEventsBySession finds events by session ID with pagination
func (r *MongoRepository) FindEventsBySession(ctx context.Context, sessionID string, limit int64, skip int64) ([]*Event, error) {
	filter := bson.M{"session_id": sessionID}
	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "timestamp", Value: -1}})

	return r.findEvents(ctx, filter, opts)
}

// FindEventsByProduct finds events by product ID with pagination
func (r *MongoRepository) FindEventsByProduct(ctx context.Context, productID string, limit int64, skip int64) ([]*Event, error) {
	filter := bson.M{"data.productId": productID}
	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "timestamp", Value: -1}})

	return r.findEvents(ctx, filter, opts)
}

// FindEventsByType finds events by type with pagination
func (r *MongoRepository) FindEventsByType(ctx context.Context, eventType EventType, limit int64, skip int64) ([]*Event, error) {
	filter := bson.M{"type": eventType}
	opts := options.Find().
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{{Key: "timestamp", Value: -1}})

	return r.findEvents(ctx, filter, opts)
}

// GetMostViewedProducts gets the most viewed products
func (r *MongoRepository) GetMostViewedProducts(ctx context.Context, limit int64) ([]map[string]interface{}, error) {
	pipeline := mongo.Pipeline{
		{
			{"$match", bson.D{
				{Key: "type", Value: ProductViewEvent},
			}},
		},
		{
			{"$group", bson.D{
				{Key: "_id", Value: "$data.productId"},
				{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
				{Key: "lastViewed", Value: bson.D{{Key: "$max", Value: "$timestamp"}}},
			}},
		},
		{
			{"$sort", bson.D{
				{Key: "count", Value: -1},
			}},
		},
		{
			{"$limit", limit},
		},
		{
			{"$project", bson.D{
				{Key: "productId", Value: "$_id"},
				{Key: "viewCount", Value: "$count"},
				{Key: "lastViewed", Value: "$lastViewed"},
				{Key: "_id", Value: 0},
			}},
		},
	}

	cursor, err := r.collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("failed to get most viewed products: %w", err)
	}
	defer cursor.Close(ctx)

	var results []map[string]interface{}
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode most viewed products: %w", err)
	}

	return results, nil
}

// GetInteractionStats gets interaction statistics
func (r *MongoRepository) GetInteractionStats(ctx context.Context) (map[string]interface{}, error) {
	// Count total events by type
	typePipeline := mongo.Pipeline{
		{
			{"$group", bson.D{
				{Key: "_id", Value: "$type"},
				{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
			}},
		},
	}

	typeCursor, err := r.collection.Aggregate(ctx, typePipeline)
	if err != nil {
		return nil, fmt.Errorf("failed to get event type stats: %w", err)
	}
	defer typeCursor.Close(ctx)

	var typeResults []struct {
		Type  string `bson:"_id"`
		Count int    `bson:"count"`
	}
	if err := typeCursor.All(ctx, &typeResults); err != nil {
		return nil, fmt.Errorf("failed to decode event type stats: %w", err)
	}

	// Count unique users and sessions
	userSessionPipeline := mongo.Pipeline{
		{
			{"$facet", bson.D{
				{Key: "users", bson.D{
					{Key: "$match", bson.D{{Key: "user_id", Value: bson.D{{Key: "$exists", Value: true}}}}},
					{Key: "$group", bson.D{{Key: "_id", Value: "$user_id"}}},
					{Key: "$count", Value: "count"},
				}},
				{Key: "sessions", bson.D{
					{Key: "$match", bson.D{{Key: "session_id", Value: bson.D{{Key: "$exists", Value: true}}}}},
					{Key: "$group", bson.D{{Key: "_id", Value: "$session_id"}}},
					{Key: "$count", Value: "count"},
				}},
				{Key: "total", bson.D{
					{Key: "$count", Value: "count"},
				}},
			}},
		},
	}

	userSessionCursor, err := r.collection.Aggregate(ctx, userSessionPipeline)
	if err != nil {
		return nil, fmt.Errorf("failed to get user/session stats: %w", err)
	}
	defer userSessionCursor.Close(ctx)

	var userSessionResults []map[string]interface{}
	if err := userSessionCursor.All(ctx, &userSessionResults); err != nil {
		return nil, fmt.Errorf("failed to decode user/session stats: %w", err)
	}

	// Build the stats response
	stats := make(map[string]interface{})
	stats["eventCounts"] = typeResults

	if len(userSessionResults) > 0 {
		stats["userSessionStats"] = userSessionResults[0]
	}

	return stats, nil
}

// findEvents is a helper function to find events based on a filter and options
func (r *MongoRepository) findEvents(ctx context.Context, filter interface{}, opts *options.FindOptions) ([]*Event, error) {
	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to find events: %w", err)
	}
	defer cursor.Close(ctx)

	var events []*Event
	if err := cursor.All(ctx, &events); err != nil {
		return nil, fmt.Errorf("failed to decode events: %w", err)
	}

	return events, nil
}
