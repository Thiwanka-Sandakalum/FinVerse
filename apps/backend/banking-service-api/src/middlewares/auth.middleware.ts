
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    institutionId?: string;
    role: string;
    iat: number;
    exp: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded: any = jwt.decode(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Map decoded JWT to JwtPayload
        req.user = {
            userId: decoded.sub,
            institutionId: decoded.o?.id,
            role: decoded.o?.rol,
            iat: decoded.iat,
            exp: decoded.exp
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Failed to decode token' });
    }
}
