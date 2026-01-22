/**
 * Authentication Middleware
 * Handles JWT token verification and authentication
 */

import { Request, Response, NextFunction } from 'express';
import { extractToken, DecodedToken } from '../utils/jwt';
import { jwtDecode } from 'jwt-decode';

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
        res.setHeader('x-user-id', sub);

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
