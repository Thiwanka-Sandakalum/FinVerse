/**
 * Jest Setup File
 * Global test configuration and mocks
 */

// Mock environment variables
process.env.AUTH0_DOMAIN = 'https://test-tenant.auth0.com';
process.env.AUTH0_CLIENT_ID = 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';
process.env.AUTH0_AUDIENCE = 'https://test-tenant.auth0.com/api/v2/';
process.env.AUTH0_API_AUDIENCE = 'https://test-api-audience';
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';

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
