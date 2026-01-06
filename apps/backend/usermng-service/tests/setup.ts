/**
 * Jest Setup File
 * Global test configuration and mocks
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables from .env.test
config({ path: resolve(__dirname, '../.env.test') });

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs in tests unless debugging
if (!process.env.DEBUG) {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    };
}
