#!/bin/bash

# Build and run FinVerse Chatbot Service
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 FinVerse Chatbot Service Docker Setup${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please update the .env file with your actual values${NC}"
    else
        echo -e "${RED}❌ .env.example file not found. Creating basic .env file${NC}"
        cat > .env << EOF
# Database Configuration
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=finverse
DATABASE_PASSWORD=password
DATABASE_NAME=finverse_db
DATABASE_SSL_MODE=PREFERRED

# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key_here

# MySQL Root Password
MYSQL_ROOT_PASSWORD=rootpassword

# Application Configuration
PORT=8085
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF
        echo -e "${GREEN}✅ Basic .env file created${NC}"
    fi
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to build the image
build_image() {
    echo -e "${BLUE}🔨 Building Docker image...${NC}"
    docker build -t finverse-chatbot:latest .
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
}

# Function to run with docker-compose
run_compose() {
    echo -e "${BLUE}🚀 Starting services with docker-compose...${NC}"
    docker-compose down --remove-orphans
    docker-compose up -d
    echo -e "${GREEN}✅ Services started successfully${NC}"
    
    # Wait for services to be healthy
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    sleep 10
    
    # Check service health
    if docker-compose ps | grep -q "Up (healthy)"; then
        echo -e "${GREEN}✅ Services are healthy and ready!${NC}"
        echo -e "${BLUE}📱 Chatbot API: http://localhost:8085${NC}"
        echo -e "${BLUE}💾 MySQL: localhost:3306${NC}"
        echo -e "${BLUE}🔄 Redis: localhost:6379${NC}"
    else
        echo -e "${YELLOW}⚠️  Services are starting up. Check logs with: docker-compose logs -f${NC}"
    fi
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Showing service logs...${NC}"
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    echo -e "${BLUE}🛑 Stopping services...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Function to clean up
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up Docker resources...${NC}"
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main menu
case "${1:-help}" in
    "build")
        check_docker
        build_image
        ;;
    "start")
        check_docker
        run_compose
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        check_docker
        stop_services
        run_compose
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        cleanup
        ;;
    "help"|*)
        echo -e "${GREEN}FinVerse Chatbot Service Docker Commands:${NC}"
        echo -e "  ${BLUE}./docker-setup.sh build${NC}    - Build Docker image"
        echo -e "  ${BLUE}./docker-setup.sh start${NC}    - Start all services"
        echo -e "  ${BLUE}./docker-setup.sh stop${NC}     - Stop all services"
        echo -e "  ${BLUE}./docker-setup.sh restart${NC}  - Restart all services"
        echo -e "  ${BLUE}./docker-setup.sh logs${NC}     - Show service logs"
        echo -e "  ${BLUE}./docker-setup.sh clean${NC}    - Clean up resources"
        echo -e "  ${BLUE}./docker-setup.sh help${NC}     - Show this help"
        echo ""
        echo -e "${YELLOW}Quick Start:${NC}"
        echo -e "  1. ${BLUE}./docker-setup.sh start${NC}"
        echo -e "  2. Open http://localhost:8085 in your browser"
        ;;
esac