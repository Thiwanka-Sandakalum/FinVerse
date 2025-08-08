#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Set PYTHONPATH to include the project root
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Initialize environment variables
set -a
source .env
set +a

# Index products in vector store
python src/scripts/index_products.py

# Start FastAPI application
uvicorn src.main:app --host 0.0.0.0 --port 8085 --reload
