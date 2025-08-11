# Azure App Service Configuration

This document outlines the environment variables that need to be configured in Azure App Service for the Banking Service API.

## Required Environment Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database?sslmode=require`
  - Example: `postgresql://user:password@your-db-host:5432/banking_service?sslmode=require`

### Server Configuration
- `NODE_ENV`: Set to `production`
- `PORT`: Will be automatically set by Azure App Service (usually 8181)
- `WEBSITES_PORT`: Azure-specific port configuration (optional)

### CORS Configuration
- `CORS_ORIGIN`: Allowed origins for CORS
  - For production: specific domain(s)
  - For testing: `*` (not recommended for production)

### Logging Configuration
- `ENABLE_REQUEST_LOGGING`: Set to `true` or `false`

### Authentication (if using Clerk)
- `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

## Azure App Service Settings

To set these in Azure App Service:

1. Go to your App Service in the Azure Portal
2. Navigate to Configuration → Application settings
3. Add each environment variable as a new application setting

## Database Connection

For Azure Database for PostgreSQL:
1. Ensure SSL is enabled in your connection string
2. Add `sslmode=require` to your DATABASE_URL
3. Make sure your Azure Database firewall allows connections from your App Service

## Startup Configuration

The deployment uses the following startup command:
```bash
npx prisma generate && node dist/index.js
```

This ensures:
1. Prisma client is generated on startup
2. The application starts with the compiled JavaScript files

## Monitoring

The health endpoint is available at:
- `GET /health` - Returns application health status and database connectivity

Use this endpoint for:
- Azure App Service health checks
- Application Insights monitoring
- Load balancer health probes
