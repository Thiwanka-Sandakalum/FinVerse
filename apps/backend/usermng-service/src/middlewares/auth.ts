/**
 * Authentication Middleware
 * Handles JWT token verification and authentication
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken, DecodedToken } from '../utils/jwt';
import { jwtDecode } from 'jwt-decode';
import { randomBytes } from 'crypto';

// Extend Request interface to include user and requestId
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
            id?: string; // Request ID for tracing
        }
    }
}

/**
 * Generate a simple request ID
 */
function generateRequestId(): string {
    return randomBytes(16).toString('hex');
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                error: 'Access token required',
                message: 'Please provide a valid access token in the Authorization header'
            });
            return;
        }

        const decodedToken = await verifyToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('JWT authentication failed:', error);
        res.status(401).json({
            error: 'Invalid token',
            message: error instanceof Error ? error.message : 'Token verification failed'
        });
    }
}

/**
 * Optional middleware - authenticates if token is provided, but doesn't require it
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = extractToken(req.headers.authorization);

        if (token) {
            const decodedToken = await verifyToken(token);
            req.user = decodedToken;
        }

        next();
    } catch (error) {
        console.warn('Optional JWT authentication failed:', error);
        // Continue without authentication
        next();
    }
}

/**
 * Middleware to decode the access token
 */
export function decodeAccessToken(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            res.status(400).json({
                error: 'Token missing',
                message: 'No access token provided in the Authorization header'
            });
            return;
        }

        const decodedToken = jwtDecode(token);
        const { orgid, role, sub } = decodedToken as { orgid: string; role: string; sub: string };

        req.user = { orgid, role, sub } as DecodedToken;
        next();
    } catch (error) {
        console.error('Token decoding failed:', error);
        res.status(400).json({
            error: 'Invalid token',
            message: error instanceof Error ? error.message : 'Token decoding failed'
        });
    }
}
