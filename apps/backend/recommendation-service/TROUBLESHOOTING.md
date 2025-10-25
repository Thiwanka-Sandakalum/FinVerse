# Recommendation Service Setup and Troubleshooting

## Quick Fix for Current Issues

### 1. Fix Dependency Conflicts

The service has dependency conflicts. To fix them:

```bash
# Option A: Use the clean install script (recommended)
./clean_install.sh

# Option B: Manual cleanup
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt
```

### 2. Fix File Watch Limit Error

The "OS file watch limit reached" error occurs when using `--reload` with too many files. Solutions:

#### Option A: Run without file watching (recommended for development)
```bash
./start.sh
```

#### Option B: Increase file watch limit (permanent fix)
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### Option C: Use file watching after increasing limit
```bash
./start.sh --with-reload
```

## Current Service Status

Good news! The service is actually running successfully despite the errors. The logs show:

- ✅ Connected to MongoDB
- ✅ Loaded recommendation model (65 products, 10 users)
- ✅ Model refresh scheduler started
- ✅ Application startup complete

## Scripts Available

1. **`./setup.sh`** - Initial setup (creates venv, installs deps, checks data)
2. **`./clean_install.sh`** - Clean reinstall of dependencies
3. **`./start.sh`** - Start service without file watching
4. **`./start.sh --with-reload`** - Start with file watching (requires increased limits)

## Integration with Banking Service

The recommendation service is ready to receive interaction data from the RabbitMQ queue we implemented. Once the banking service starts sending product view and search events, this service will:

1. Receive events via RabbitMQ consumer
2. Store interaction data in MongoDB
3. Retrain the recommendation model periodically
4. Provide personalized recommendations via the API

## API Endpoints

The service should be available at `http://localhost:4003` with endpoints like:
- `GET /health` - Health check
- `GET /recommendations/{user_id}` - Get recommendations for user
- `POST /train` - Manually trigger model training

## Next Steps

1. Run the clean install to fix dependencies
2. Start the service without reload to avoid file watch issues  
3. Test the banking service RabbitMQ integration
4. Verify that interaction data flows from banking → queue → recommendation service
