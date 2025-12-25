/**
 * Server Entry Point
 * Starts the Express server
 */

import './config/loadEnv';
import app from './app';
import { config } from './config/env';

app.listen(config.PORT, () => {
    console.log(`User Management Service running on port ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
});
