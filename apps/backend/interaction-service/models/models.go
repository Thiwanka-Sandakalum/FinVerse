package models

// InteractionEvent represents a general user interaction
type InteractionEvent struct {
	UserID    string                 `json:"userId,omitempty"`
	ProductID string                 `json:"productId,omitempty"`
	Action    string                 `json:"action"`
	SessionID string                 `json:"sessionId,omitempty"`
	Source    string                 `json:"source,omitempty"`
	Data      map[string]interface{} `json:"data,omitempty"`
}

// ProductViewEvent represents a product view interaction
type ProductViewEvent struct {
	UserID         string   `json:"userId,omitempty"`
	ProductID      string   `json:"productId"`
	ViewDuration   int      `json:"viewDuration,omitempty"`
	SessionID      string   `json:"sessionId,omitempty"`
	Source         string   `json:"source,omitempty"`
	ViewedFeatures []string `json:"viewedFeatures,omitempty"`
}

// ComparisonEvent represents a product comparison interaction
type ComparisonEvent struct {
	UserID             string   `json:"userId,omitempty"`
	ProductIDs         []string `json:"productIds"`
	SessionID          string   `json:"sessionId,omitempty"`
	ComparisonDuration int      `json:"comparisonDuration,omitempty"`
}

// SearchEvent represents a search interaction
type SearchEvent struct {
	UserID          string                 `json:"userId,omitempty"`
	Query           string                 `json:"query"`
	Filters         map[string]interface{} `json:"filters,omitempty"`
	ResultCount     int                    `json:"resultCount,omitempty"`
	SelectedProduct string                 `json:"selectedProduct,omitempty"`
	SessionID       string                 `json:"sessionId,omitempty"`
}

// UserPreference represents user preferences
type UserPreference struct {
	UserID            string                 `json:"userId"`
	Preferences       map[string]interface{} `json:"preferences"`
	InferredInterests map[string]interface{} `json:"inferredInterests,omitempty"`
}

// ApplicationIntent represents a user's intent to apply for a product
type ApplicationIntent struct {
	UserID      string `json:"userId"`
	ProductID   string `json:"productId"`
	Completed   bool   `json:"completed,omitempty"`
	AbandonedAt string `json:"abandonedAt,omitempty"`
	Source      string `json:"source,omitempty"`
}

// PaginationParams represents pagination parameters
type PaginationParams struct {
	Limit int64 `form:"limit,default=20"`
	Skip  int64 `form:"skip,default=0"`
}

// Response represents a generic API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// HealthResponse represents a health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	Version   string `json:"version"`
}
