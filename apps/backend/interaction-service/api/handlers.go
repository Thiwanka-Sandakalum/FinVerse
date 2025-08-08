package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/finverse/interaction-service/models"
	"github.com/finverse/interaction-service/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// Handler handles API requests
type Handler struct {
	service *services.InteractionService
	logger  *logrus.Logger
}

// NewHandler creates a new API handler
func NewHandler(service *services.InteractionService, logger *logrus.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// TrackInteraction handles tracking general interactions
func (h *Handler) TrackInteraction(c *gin.Context) {
	var event models.InteractionEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		h.logger.Errorf("Failed to bind interaction event: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid request: " + err.Error(),
		})
		return
	}

	if err := h.service.TrackInteraction(c.Request.Context(), event); err != nil {
		h.logger.Errorf("Failed to track interaction: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to track interaction",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Interaction tracked successfully",
	})
}

// TrackProductView handles tracking product view events
func (h *Handler) TrackProductView(c *gin.Context) {
	var event models.ProductViewEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		h.logger.Errorf("Failed to bind product view event: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid request: " + err.Error(),
		})
		return
	}

	if event.ProductID == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Product ID is required",
		})
		return
	}

	if err := h.service.TrackProductView(c.Request.Context(), event); err != nil {
		h.logger.Errorf("Failed to track product view: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to track product view",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Product view tracked successfully",
	})
}

// TrackComparison handles tracking comparison events
func (h *Handler) TrackComparison(c *gin.Context) {
	var event models.ComparisonEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		h.logger.Errorf("Failed to bind comparison event: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid request: " + err.Error(),
		})
		return
	}

	if len(event.ProductIDs) == 0 {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "At least one product ID is required",
		})
		return
	}

	if err := h.service.TrackComparison(c.Request.Context(), event); err != nil {
		h.logger.Errorf("Failed to track comparison: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to track comparison",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Comparison tracked successfully",
	})
}

// TrackSearch handles tracking search events
func (h *Handler) TrackSearch(c *gin.Context) {
	var event models.SearchEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		h.logger.Errorf("Failed to bind search event: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid request: " + err.Error(),
		})
		return
	}

	if event.Query == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Search query is required",
		})
		return
	}

	if err := h.service.TrackSearch(c.Request.Context(), event); err != nil {
		h.logger.Errorf("Failed to track search: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to track search",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Search tracked successfully",
	})
}

// GetUserInteractions handles retrieving user interactions
func (h *Handler) GetUserInteractions(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "User ID is required",
		})
		return
	}

	var params models.PaginationParams
	if err := c.ShouldBindQuery(&params); err != nil {
		h.logger.Errorf("Failed to bind pagination params: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid pagination parameters",
		})
		return
	}

	events, err := h.service.GetUserInteractions(c.Request.Context(), userID, params.Limit, params.Skip)
	if err != nil {
		h.logger.Errorf("Failed to get user interactions: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to get user interactions",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    events,
	})
}

// GetSessionInteractions handles retrieving session interactions
func (h *Handler) GetSessionInteractions(c *gin.Context) {
	sessionID := c.Param("sessionId")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Session ID is required",
		})
		return
	}

	var params models.PaginationParams
	if err := c.ShouldBindQuery(&params); err != nil {
		h.logger.Errorf("Failed to bind pagination params: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid pagination parameters",
		})
		return
	}

	events, err := h.service.GetSessionInteractions(c.Request.Context(), sessionID, params.Limit, params.Skip)
	if err != nil {
		h.logger.Errorf("Failed to get session interactions: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to get session interactions",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    events,
	})
}

// GetProductInteractions handles retrieving product interactions
func (h *Handler) GetProductInteractions(c *gin.Context) {
	productID := c.Param("productId")
	if productID == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Product ID is required",
		})
		return
	}

	var params models.PaginationParams
	if err := c.ShouldBindQuery(&params); err != nil {
		h.logger.Errorf("Failed to bind pagination params: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid pagination parameters",
		})
		return
	}

	events, err := h.service.GetProductInteractions(c.Request.Context(), productID, params.Limit, params.Skip)
	if err != nil {
		h.logger.Errorf("Failed to get product interactions: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to get product interactions",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    events,
	})
}

// GetMostViewedProducts handles retrieving most viewed products
func (h *Handler) GetMostViewedProducts(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.ParseInt(limitStr, 10, 64)
	if err != nil {
		h.logger.Errorf("Failed to parse limit parameter: %v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Invalid limit parameter",
		})
		return
	}

	products, err := h.service.GetMostViewedProducts(c.Request.Context(), limit)
	if err != nil {
		h.logger.Errorf("Failed to get most viewed products: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to get most viewed products",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    products,
	})
}

// GetInteractionStats handles retrieving interaction statistics
func (h *Handler) GetInteractionStats(c *gin.Context) {
	stats, err := h.service.GetInteractionStats(c.Request.Context())
	if err != nil {
		h.logger.Errorf("Failed to get interaction stats: %v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Error:   "Failed to get interaction statistics",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    stats,
	})
}

// HealthCheck handles health check requests
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.HealthResponse{
		Status:    "OK",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Version:   "1.0.0",
	})
}
