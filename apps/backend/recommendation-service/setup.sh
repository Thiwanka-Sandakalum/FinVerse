#!/bin/bash

# Setup script for the recommendation service

# Create necessary directories
mkdir -p data
mkdir -p logs

echo "Setting up recommendation service..."

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
DEBUG=true
API_HOST=0.0.0.0
API_PORT=4003
MONGO_URI=mongodb://localhost:27017
MONGO_DB=finverse_interactions
BANKING_SERVICE_URL=http://localhost:4001/api/v1
MODEL_REFRESH_INTERVAL=3600
EOF
    echo ".env file created."
fi

# Run initial data check
echo "Running initial data check..."
python -c "
from src.services.db_service import DBService
import asyncio
import motor.motor_asyncio
from datetime import datetime

async def check_data():
    print('Connecting to MongoDB...')
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.finverse_interactions
    db_service = DBService(db)
    
    print('Checking interaction data...')
    user_count = len(await db_service.get_all_users())
    product_count = len(await db_service.get_all_products())
    interaction_count = len(await db_service.get_user_product_interactions(limit=100))
    
    print(f'Found {user_count} users')
    print(f'Found {product_count} products')
    print(f'Found {interaction_count} interactions')
    
    if interaction_count == 0:
        print('Warning: No interaction data found. The recommendation model will not work without data.')
        print('Make sure the interaction service is running and collecting data.')
    else:
        print('Data found! The recommendation service should work properly.')
    
    client.close()

asyncio.run(check_data())
"

# Print success message
echo ""
echo "Setup complete! To start the recommendation service, run:"
echo "docker-compose up -d"
echo "or"
echo "source venv/bin/activate && uvicorn src.main:app --host 0.0.0.0 --port 4003 --reload"
echo ""
