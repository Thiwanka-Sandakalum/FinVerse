/**
 * Express Application Setup
 * Configures middleware and routes
 */

import express from 'express';
import cors from 'cors';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import { decodeAccessToken } from './middlewares/auth';
import { requestIdMiddleware } from './middlewares/requestId';

const app = express();

// Request ID middleware (should be first to trace all requests)
app.use(requestIdMiddleware);

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
}));

// Authentication middleware
app.use(decodeAccessToken);

// Body parser
app.use(express.json());

// Routes
app.use(routes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
