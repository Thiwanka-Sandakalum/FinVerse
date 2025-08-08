#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default Docker Hub repository and tag
DOCKER_REPO="kalum2002/bankguru-chat"
TAG_NAME="latest"

echo -e "${GREEN}Starting FinVerse Chatbot Service Docker Setup...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from .env.example...${NC}"
    
    # Check if .env.example exists
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}Created .env file from .env.example. Please edit the file to add your API keys and configurations.${NC}"
    else
        echo -e "${RED}Error: .env.example file not found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Process command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tag=*)
      TAG_NAME="${1#*=}"
      shift
      ;;
    --push)
      SHOULD_PUSH=true
      shift
      ;;
    --prod)
      BUILD_PROD=true
      shift
      ;;
    --help)
      echo -e "${BLUE}Usage:${NC}"
      echo -e "  ./docker-setup.sh [options]"
      echo -e ""
      echo -e "${BLUE}Options:${NC}"
      echo -e "  --tag=NAME     Specify the tag name for the Docker image (default: latest)"
      echo -e "  --push         Build and push the image to Docker Hub"
      echo -e "  --prod         Build using the production Dockerfile"
      echo -e "  --help         Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo -e "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Create necessary directories
mkdir -p data/vectordb

# Build and start containers
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker-compose up -d --build

echo -e "${GREEN}Waiting for database to initialize...${NC}"
sleep 10

# Initialize database and index products
echo -e "${GREEN}Initializing database and indexing products...${NC}"
docker-compose exec chatbot python src/scripts/init_db.py
docker-compose exec chatbot python src/scripts/index_products.py

echo -e "${GREEN}FinVerse Chatbot Service is now running!${NC}"
echo -e "${GREEN}Access the API at: http://localhost:8085${NC}"
echo -e "${GREEN}Access the API documentation at: http://localhost:8085/docs${NC}"

# Build and push Docker image if requested
if [ "$SHOULD_PUSH" = true ]; then
    echo -e "${GREEN}Building Docker image for publishing...${NC}"
    
    # Determine which Dockerfile to use
    if [ "$BUILD_PROD" = true ]; then
        DOCKERFILE="Dockerfile.prod"
        IMAGE_NAME="${DOCKER_REPO}:${TAG_NAME}-prod"
    else
        DOCKERFILE="Dockerfile"
        IMAGE_NAME="${DOCKER_REPO}:${TAG_NAME}"
    fi
    
    echo -e "${GREEN}Building image ${IMAGE_NAME} using ${DOCKERFILE}...${NC}"
    docker build -t "$IMAGE_NAME" -f "$DOCKERFILE" .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Image built successfully!${NC}"
        
        # Check if user is logged in to Docker Hub
        if ! docker info | grep -q "Username"; then
            echo -e "${YELLOW}You are not logged in to Docker Hub. Please log in:${NC}"
            docker login
        fi
        
        # Push the image to Docker Hub
        echo -e "${GREEN}Pushing image to Docker Hub...${NC}"
        docker push "$IMAGE_NAME"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Image pushed successfully to Docker Hub!${NC}"
            echo -e "${GREEN}Image: ${IMAGE_NAME}${NC}"
        else
            echo -e "${RED}Failed to push image to Docker Hub.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Failed to build Docker image.${NC}"
        exit 1
    fi
fi
