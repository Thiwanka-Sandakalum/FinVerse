/**
 * Request ID Middleware
 * Attaches a unique ID to each incoming request for tracing
 */

import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
    return randomBytes(16).toString('hex');
}

/**
 * Middleware to attach request ID to all incoming requests
 * Checks for existing X-Request-ID header first
 */
export const requestIdMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    // Use existing request ID from header if present, otherwise generate new one
    req.id = (req.headers['x-request-id'] as string) || generateRequestId();
    next();
};
