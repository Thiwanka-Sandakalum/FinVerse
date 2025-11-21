import * as UserService from './user.service';
import { Request, Response, NextFunction } from 'express';
import { LoginCallbackRequest } from './user.types';
import { extractToken } from '../../utils/jwt';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await UserService.getUsers(req.query);
        res.json(users);
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.getUserById(req.params.id, req.query);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function loginCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body as LoginCallbackRequest;
        let token = body.token;

        // If token is not in body, try to extract from Authorization header
        if (!token) {
            token = extractToken(req.headers.authorization) || '';
        }

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required in request body or Authorization header'
            });
        }

        const result = await UserService.handleLoginCallback(token);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        next(error);
    }
}
