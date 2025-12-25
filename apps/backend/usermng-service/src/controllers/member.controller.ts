/**
 * Member Controller
 * Handles HTTP requests and responses for organization member operations
 */

import { Request, Response, NextFunction } from 'express';
import * as MemberService from '../services/member.service';
import { paginatedResponse, deletedResponse, itemResponse } from '../utils/response';

export async function getOrganizationMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { items, pagination } = await MemberService.getOrganizationMembers(req.params.orgId, req.query);

        paginatedResponse(
            res,
            items,
            pagination.page,
            pagination.limit,
            pagination.total,
            'Organization members retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteOrganizationMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await MemberService.deleteOrganizationMembers(req.params.orgId, req.body.members);

        deletedResponse(
            res,
            'Organization members deleted successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function getOrganizationMemberRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { items: roles, pagination } = await MemberService.getOrganizationMemberRoles(
            req.params.orgId,
            req.params.userId,
            req.query
        );

        paginatedResponse(
            res,
            roles,
            pagination.page,
            pagination.limit,
            pagination.total,
            'Member roles retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function assignOrganizationMemberRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await MemberService.assignOrganizationMemberRoles(req.params.orgId, req.params.userId, req.body.roles);

        itemResponse(
            res,
            null,
            'Roles assigned to member successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}
