import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken, DecodedToken } from '../utils/jwt';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

/**
 * Middleware to authenticate JWT tokens
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                message: 'Please provide a valid access token in the Authorization header'
            });
        }

        const decodedToken = await verifyToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('JWT authentication failed:', error);
        return res.status(401).json({
            error: 'Invalid token',
            message: error instanceof Error ? error.message : 'Token verification failed'
        });
    }
}

/**
 * Optional middleware - authenticates if token is provided, but doesn't require it
 * @param req Express request
 * @param res Express response
 * @param next Next function
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
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