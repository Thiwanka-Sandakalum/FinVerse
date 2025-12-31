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
require('dotenv').config();

const app = express();

// Request ID middleware (should be first to trace all requests)
app.use(requestIdMiddleware);

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'userid', 'userId', 'x-user-id'],
    credentials: true,
}));

// Authentication middleware
app.use(decodeAccessToken);

// Body parser
app.use(express.json());

app.get('/', (req, res) => {
    res.send('User Management Service is running');
});

// Routes
app.use(routes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(3001, () => {
    console.log("User Management Service running on port 3001");
})