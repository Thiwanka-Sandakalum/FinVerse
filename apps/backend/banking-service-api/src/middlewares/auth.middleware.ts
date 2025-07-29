import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware';
import { AuthRequest, JwtPayload } from '../types/api.types';

/**
 * Middleware to authenticate requests using JWT
 * Extracts the JWT from the Authorization header and verifies it
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new ApiError(401, 'Authentication required');
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Invalid authentication token format');
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new ApiError(500, 'JWT secret is not defined');
        }
        const decoded = jwt.verify(token, jwtSecret) as unknown as JwtPayload;

        // Add user to request object
        (req as AuthRequest).user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new ApiError(401, 'Invalid authentication token'));
        } else {
            next(error);
        }
    }
};

/**
 * Middleware to check if user is an institution admin
 * Must be called after the authenticate middleware
 */
export const isInstitutionAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
        return next(new ApiError(401, 'Authentication required'));
    }

    if (authReq.user.role !== 'INSTITUTION_ADMIN') {
        return next(new ApiError(403, 'Access denied: Requires institution admin privileges'));
    }

    next();
};

/**
 * Middleware to check if user is a system admin
 * Must be called after the authenticate middleware
 */
export const isSystemAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
        return next(new ApiError(401, 'Authentication required'));
    }

    if (authReq.user.role !== 'SYSTEM_ADMIN') {
        return next(new ApiError(403, 'Access denied: Requires system admin privileges'));
    }

    next();
};

/**
 * Middleware to check if user is the owner of a resource
 * @param entityKey The key to check ownership for (e.g., 'userId', 'createdBy')
 */
export const isResourceOwner = (entityKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        const resource = res.locals.resource;

        if (!authReq.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        if (!resource) {
            return next(new ApiError(500, 'Resource not found in middleware context'));
        }

        if (resource[entityKey] !== authReq.user.userId) {
            return next(new ApiError(403, 'Access denied: You are not the owner of this resource'));
        }

        next();
    };
};

/**
 * Unified authentication middleware that can be used for all routes
 * This is an alias for the authenticate middleware to maintain consistency
 * with naming conventions across the codebase
 */
export const authenticateJwt = authenticate;
