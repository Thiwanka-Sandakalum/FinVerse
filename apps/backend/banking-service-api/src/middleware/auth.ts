/**
 * Authentication Middleware
 * Handles JWT token verification and authentication
 */

import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
    sub: string; // User ID
    aud: string | string[]; // Audience
    iss: string; // Issuer
    exp: number; // Expiration time
    iat: number; // Issued at
    azp?: string; // Authorized party
    scope?: string;
    orgid?: string; // Organization ID
    role?: string; // User role
    [key: string]: any; // Additional claims
}
// Extend Request interface to include user and requestId
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
            id?: string; // Request ID for tracing
        }
    }
}

export function extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
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
        console.log('Decoded Token:', req.user);
        next();
    } catch (error) {
        console.error('Token decoding failed:', error);
        res.status(400).json({
            error: 'Invalid token',
            message: error instanceof Error ? error.message : 'Token decoding failed'
        });
    }
}
