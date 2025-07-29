import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { logger, stream } from './config/logger';
import prisma from './config/database';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
// import { trackInteractions } from './middlewares/interaction-tracking.middleware';

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
const PORT = process.env.PORT || 3000;
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

// Middleware
// app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
    app.use(morgan('combined', { stream }));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Apply interaction tracking middleware for relevant routes
// app.use(trackInteractions);

// API routes
app.use(`${API_PREFIX}/institutions/types`, institutionTypeRoutes);
app.use(`${API_PREFIX}/institutions`, institutionRoutes);
app.use(`${API_PREFIX}/product-categories`, productCategoryRoutes);
app.use(`${API_PREFIX}/product-types`, productTypeRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/products`, productRateHistoryRoutes);
app.use(`${API_PREFIX}/products`, productVersionRoutes);
app.use(`${API_PREFIX}/saved-products`, savedProductRoutes);
app.use(`${API_PREFIX}/compare-list`, compareListRoutes);
app.use(`${API_PREFIX}/shared-products`, sharedLinkRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/products/tags`, tagRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`API endpoints available at http://localhost:${PORT}${API_PREFIX}`);
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
        prisma.$disconnect().then(() => {
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
});

export default app;
