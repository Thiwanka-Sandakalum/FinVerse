import express from 'express';
import cors from 'cors';
import path from 'path';
const OpenApiValidator = require('express-openapi-validator');
import { logger } from './config/logger';
import productRoutes from './routes/product.routes';
import dataExtractorMiddleware from './middleware/data-extractor.middleware';
import { errorHandler } from './middleware/errorHandler';

const ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();


app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info(`API Request: ${req.method} ${req.path}`);
    next();
});


app.use(
    OpenApiValidator.middleware({
        apiSpec: path.resolve(__dirname, '../', 'banking-service-api.yaml'),
        validateRequests: true,
        validateResponses: false,
    }),
);
app.use(dataExtractorMiddleware);

app.use('/products', productRoutes);

app.use(errorHandler);

export default app;

