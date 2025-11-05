import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';

import { logger, stream } from './config/logger';
import prisma from './config/database';
import { createErrorHandler } from './utils/error-handler';

// Import routes
import productRoutes from './routes/product.routes';
import dataExtractorMiddleware from './middlewares/data-extractor.middleware';

// Types
interface ServerConfig {
    port: number;
    corsOrigin: string;
    environment: string;
    apiDocsUrl: string;
    enableRequestLogging: boolean;
}

// Pure function to create server configuration
const createServerConfig = (): ServerConfig => ({
    port: Number(process.env.PORT || process.env.WEBSITES_PORT || 8181),
    corsOrigin: process.env.CORS_ORIGIN || '*',
    environment: process.env.NODE_ENV || 'development',
    apiDocsUrl: process.env.API_DOCS_URL || `http://localhost:${process.env.PORT || 8181}/api/docs`,
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false'
});

// Pure function to configure middleware
const configureMiddleware = (app: Application, config: ServerConfig): void => {
    app.use(cors({ origin: config.corsOrigin, credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(OpenApiValidator.middleware({
        apiSpec: path.resolve(__dirname, '../', 'banking-service-api.yaml'),
        validateRequests: true,
        validateResponses: false,
    }));

    if (config.enableRequestLogging) {
        app.use(morgan('combined', { stream }));
    }

    app.use(dataExtractorMiddleware);

    app.use(createErrorHandler());
};

// Pure function to configure routes
const configureRoutes = (app: Application): void => {
    app.use('/products', productRoutes);
};

// Pure function to setup process handlers
const setupProcessHandlers = (server: any): void => {
    const handleGracefulShutdown = async () => {
        logger.info('SIGTERM signal received: closing HTTP server');

        try {
            await new Promise(resolve => server.close(resolve));
            logger.info('HTTP server closed');

            await prisma.$disconnect();
            logger.info('Database connection closed');

            process.exit(0);
        } catch (err) {
            logger.error('Error during graceful shutdown:', err);
            process.exit(1);
        }
    };

    const handleUncaughtError = (err: Error, source: string) => {
        logger.error(`${source}:`, err);
        server.close(() => process.exit(1));
    };

    process.on('SIGTERM', handleGracefulShutdown);
    process.on('unhandledRejection', (err: Error) => handleUncaughtError(err, 'Unhandled Promise Rejection'));
    process.on('uncaughtException', (err: Error) => handleUncaughtError(err, 'Uncaught Exception'));
};

// Pure function to create and configure the Express app
const createApp = (): Application => {
    const app = express();
    const config = createServerConfig();

    configureMiddleware(app, config);
    configureRoutes(app);

    return app;
};

// Async function to start the server
const startServer = async (): Promise<any> => {
    const app = createApp();
    const config = createServerConfig();

    try {
        await prisma.$connect();
        logger.info('Database connection established successfully');

        const server = app.listen(config.port, () => {
            logger.info(`FinVerse Banking Service API v1.1.0`);
            logger.info(`Environment: ${config.environment}`);
            logger.info(`Server listening on port ${config.port}`);
            logger.info(`API documentation available at ${config.apiDocsUrl}`);
        });

        setupProcessHandlers(server);
        return server;
    } catch (error) {
        logger.error('Failed to start server:', error);
        throw error;
    }
};

// Initialize server with proper error handling
(async () => {
    try {
        await startServer();
    } catch (error) {
        logger.error('Server startup failed:', error);
        process.exit(1);
    }
})();

export default createApp();

