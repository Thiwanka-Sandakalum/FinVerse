import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { logger, stream } from './config/logger';
import prisma from './config/database';

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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import auth middleware from module
import { authMiddleware } from './middlewares/auth.middleware';

// Use auth middleware before API routes
// app.use(authMiddleware);

// Request logging
if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
    app.use(morgan('combined', { stream }));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API routes
app.use('/institution-types', institutionTypeRoutes);
app.use('/institutions', institutionRoutes);
app.use('/product-categories', productCategoryRoutes);
app.use('/product-types', productTypeRoutes);
app.use('/products', productRoutes);
app.use('/products/rate-history', productRateHistoryRoutes);
app.use('/products/versions', productVersionRoutes);
app.use('/saved-products', savedProductRoutes);
app.use('/compare-list', compareListRoutes);
app.use('/shared-products', sharedLinkRoutes);
app.use('/reviews', reviewRoutes);
app.use('/products/tags', tagRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
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
        prisma.$disconnect().then(() => {
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
});

export default app;

