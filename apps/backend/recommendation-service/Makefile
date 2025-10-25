# FinVerse Recommendation Service - Makefile
# ===========================================

# Variables
VENV = venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
UVICORN = uvicorn
SERVICE_MODULE = src.main:app
HOST = 0.0.0.0
PORT = 4003

# Colors for output
BLUE = \033[34m
GREEN = \033[32m
YELLOW = \033[33m
RED = \033[31m
NC = \033[0m # No Color

.PHONY: help venv install dev start start-prod test lint clean health

# Default target
help: ## Show this help message
	@echo "$(BLUE)FinVerse Recommendation Service$(NC)"
	@echo "================================="
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

$(VENV)/bin/activate: ## Create virtual environment
	python3 -m venv $(VENV)

venv: $(VENV)/bin/activate ## Create virtual environment
	@echo "$(GREEN)✅ Virtual environment created: $(VENV)$(NC)"

install: venv ## Install dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	$(PIP) install -r requirements.txt

dev: venv ## Install development dependencies
	@echo "$(YELLOW)Installing development dependencies...$(NC)"
	$(PIP) install -r requirements.txt
	$(PIP) install ruff mypy pytest pytest-cov black isort

start: ## Start the service in development mode
	@echo "$(GREEN)🚀 Starting FinVerse Recommendation Service (Development)...$(NC)"
	@echo "$(BLUE)📍 Service URL: http://$(HOST):$(PORT)$(NC)"
	@echo "$(BLUE)📚 API Docs: http://$(HOST):$(PORT)/docs$(NC)"
	@echo "$(BLUE)❤️  Health Check: http://$(HOST):$(PORT)/health$(NC)"
	@echo ""
	@if [ -f .env ]; then \
		echo "$(YELLOW)📋 Loading environment from .env file...$(NC)"; \
		set -a; source .env; set +a; \
	fi
	$(PYTHON) -m $(UVICORN) $(SERVICE_MODULE) \
		--host $(HOST) \
		--port $(PORT) \
		--reload \
		--log-level info

start-prod: ## Start the service in production mode
	@echo "$(GREEN)🚀 Starting FinVerse Recommendation Service (Production)...$(NC)"
	$(PYTHON) -m $(UVICORN) $(SERVICE_MODULE) \
		--host $(HOST) \
		--port $(PORT) \
		--workers 4 \
		--log-level warning

start-simple: ## Start using the simple Python script
	@echo "$(GREEN)🚀 Starting with Python script...$(NC)"
	$(PYTHON) start.py

start-direct: ## Start by running main.py directly
	@echo "$(GREEN)🚀 Starting directly with main.py...$(NC)"
	$(PYTHON) -m src.main

test: ## Run tests
	@echo "$(YELLOW)Running tests...$(NC)"
	$(PYTHON) -m pytest tests/ -v

lint: ## Run code quality checks
	@echo "$(YELLOW)Running code quality checks...$(NC)"
	ruff check src/ --fix
	ruff format src/
	mypy src/

clean: ## Clean up cache files
	@echo "$(YELLOW)Cleaning up...$(NC)"
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete
	rm -rf .pytest_cache/
	rm -rf data/*.pkl data/*.npz data/*.json 2>/dev/null || true
	rm -f logs/*.log

clean-all: clean ## Clean everything including virtual environment
	@echo "$(YELLOW)Removing virtual environment...$(NC)"
	rm -rf $(VENV)

activate: ## Show command to activate virtual environment
	@echo "$(GREEN)To activate the virtual environment, run:$(NC)"
	@echo "$(BLUE)source $(VENV)/bin/activate$(NC)"

health: ## Check service health (requires service to be running)
	@echo "$(YELLOW)Checking service health...$(NC)"
	curl -s http://$(HOST):$(PORT)/health | python3 -m json.tool || echo "$(RED)Service not running or not responding$(NC)"

logs: ## Show recent logs
	@echo "$(YELLOW)Recent logs:$(NC)"
	tail -f logs/recommendation-service.log 2>/dev/null || echo "$(RED)No log file found$(NC)"

# Development workflow
setup: install ## Full setup for development
	@echo "$(GREEN)✅ Development environment ready!$(NC)"
	@echo "$(BLUE)Next steps:$(NC)"
	@echo "  1. Copy .env.example to .env and configure"
	@echo "  2. Run 'make start' to start the service"
	@echo "$(YELLOW)Note: Virtual environment created at ./$(VENV)$(NC)"

# Docker commands (if needed later)
docker-build: ## Build Docker image
	docker build -t finverse-recommendation-service .

docker-run: ## Run Docker container
	docker run -p $(PORT):$(PORT) --env-file .env finverse-recommendation-service