import * as UserService from './user.service';
import { Request, Response, NextFunction } from 'express';

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
