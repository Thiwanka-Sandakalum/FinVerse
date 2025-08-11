import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { logger, stream } from './config/logger';
import prisma from './config/database';
import { queueService } from './services/queue.service';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Import routes
import productRoutes from './routes/product.routes';
import savedProductRoutes from './routes/saved-product.routes';
import compareListRoutes from './routes/compare-list.routes';
import sharedLinkRoutes from './routes/shared-link.routes';
import reviewRoutes from './routes/review.routes';
import tagRoutes from './routes/tag.routes';
import institutionRoutes from './routes/institution.routes';
import institutionTypeRoutes from './routes/institution-type.routes';
import productCategoryRoutes from './routes/product-category.routes';
import productTypeRoutes from './routes/product-type.routes';
import productRateHistoryRoutes from './routes/product-rate-history.routes';
import productVersionRoutes from './routes/product-version.routes';

// Initialize express app
const app = express();
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8181;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import auth middleware from module
import { authMiddleware, optionalAuthMiddleware } from './middlewares/auth.middleware';


// Request logging
if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
    app.use(morgan('combined', { stream }));
}

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
    try {
        // Basic health check
        const healthStatus: any = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            port: PORT
        };

        // Test database connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            healthStatus.database = 'Connected';
        } catch (dbError) {
            logger.error('Database health check failed:', dbError);
            healthStatus.database = 'Disconnected';
            healthStatus.status = 'WARNING';
        }

        // Test RabbitMQ connection
        try {
            healthStatus.messageQueue = queueService.isQueueConnected() ? 'Connected' : 'Disconnected';
            if (!queueService.isQueueConnected()) {
                healthStatus.status = 'WARNING';
            }
        } catch (queueError) {
            logger.error('Queue health check failed:', queueError);
            healthStatus.messageQueue = 'Error';
            healthStatus.status = 'WARNING';
        }

        res.status(200).json(healthStatus);
    } catch (error) {
        logger.error('Health check failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: errorMessage
        });
    }
});

// API routes
// Public routes with optional auth (for user-specific indicators)
app.use('/products', optionalAuthMiddleware, productRoutes);

// Public routes (no auth required, but optional auth for user context)
app.use('/institution-types', optionalAuthMiddleware, institutionTypeRoutes);
app.use('/institutions', optionalAuthMiddleware, institutionRoutes);
app.use('/product-categories', optionalAuthMiddleware, productCategoryRoutes);
app.use('/product-types', optionalAuthMiddleware, productTypeRoutes);
app.use('/products/tags', optionalAuthMiddleware, tagRoutes);

// Protected routes (auth required)
app.use('/saved-products', authMiddleware, savedProductRoutes);
app.use('/compare-list', authMiddleware, compareListRoutes);
app.use('/shared-products', authMiddleware, sharedLinkRoutes);
app.use('/reviews', authMiddleware, reviewRoutes);
app.use('/products/rate-history', authMiddleware, productRateHistoryRoutes);
app.use('/products/versions', authMiddleware, productVersionRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('Database connection established successfully');

        const server = app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            logger.info(`API endpoints available at http://localhost:${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: Error) => {
            logger.error('Unhandled Promise Rejection:', err);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err: Error) => {
            logger.error('Uncaught Exception:', err);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

        // Handle SIGTERM signal
        process.on('SIGTERM', () => {
            logger.info('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                logger.info('HTTP server closed');

                // Close queue connection
                queueService.close().then(() => {
                    logger.info('Queue connection closed');
                }).catch(err => {
                    logger.error('Error closing queue connection:', err);
                });

                // Close database connection
                prisma.$disconnect().then(() => {
                    logger.info('Database connection closed');
                    process.exit(0);
                });
            });
        });

        return server;
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer().catch((error) => {
    logger.error('Server startup failed:', error);
    process.exit(1);
});

export default app;

