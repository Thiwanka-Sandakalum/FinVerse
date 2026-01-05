/**
 * Test Server Setup
 * Configures Express app for integration testing
 */

import express from 'express';
import cors from 'cors';
import routes from '../../../src/routes';
import errorHandler from '../../../src/middlewares/errorHandler';
import { requestIdMiddleware } from '../../../src/middlewares/requestId';

/**
 * Creates a test instance of the Express app
 * Does NOT include auth middleware (we'll mock it per test)
 */
export function createTestApp() {
    const app = express();

    // Request ID middleware
    app.use(requestIdMiddleware);

    // CORS configuration
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
        credentials: true,
    }));

    // Body parser
    app.use(express.json());

    // Routes
    app.use(routes);

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
}
