/**
 * User Controller
 * Handles HTTP requests and responses for user operations
 */

import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';
import { paginatedResponse, itemResponse, updatedResponse, deletedResponse } from '../utils/response';

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await UserService.getUsers(req.query);

        // Handle both paginated and non-paginated responses
        if (result && typeof result === 'object' && 'users' in result && 'total' in result) {
            // Paginated response
            const page = parseInt(req.query.page as string) || 0;
            const limit = parseInt(req.query.per_page as string) || 50;

            paginatedResponse(
                res,
                result.users,
                page,
                limit,
                result.total || 0,
                'Users retrieved successfully',
                req.id
            );
        } else {
            // Non-paginated array response
            itemResponse(
                res,
                result,
                'Users retrieved successfully',
                req.id
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await UserService.getUserById(req.params.id, req.query);

        itemResponse(
            res,
            user,
            'User retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);

        updatedResponse(
            res,
            user,
            'User updated successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await UserService.deleteUser(req.params.id);

        deletedResponse(
            res,
            'User deleted successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}
