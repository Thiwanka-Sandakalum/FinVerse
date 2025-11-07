import * as MemberService from './member.service';
import { Request, Response, NextFunction } from 'express';
import { sendPaginatedResponse, sendNoContentResponse } from '../../utils/response';

export async function getOrganizationMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const { items, pagination } = await MemberService.getOrganizationMembers(req.params.orgId, req.query);
        sendPaginatedResponse(res, items, pagination.page, pagination.limit, pagination.total);
    } catch (error) {
        next(error);
    }
}

export async function deleteOrganizationMembers(req: Request, res: Response, next: NextFunction) {
    try {
        await MemberService.deleteOrganizationMembers(req.params.orgId, req.body.members);
        sendNoContentResponse(res);
    } catch (error) {
        next(error);
    }
}

export async function getOrganizationMemberRoles(req: Request, res: Response, next: NextFunction) {
    try {
        const { items: roles, pagination } = await MemberService.getOrganizationMemberRoles(
            req.params.orgId,
            req.params.userId,
            req.query
        );
        sendPaginatedResponse(res, roles, pagination.page, pagination.limit, pagination.total);
    } catch (error) {
        next(error);
    }
}

export async function assignOrganizationMemberRoles(req: Request, res: Response, next: NextFunction) {
    try {
        await MemberService.assignOrganizationMemberRoles(req.params.orgId, req.params.userId, req.body.roles);
        sendNoContentResponse(res);
    } catch (error) {
        next(error);
    }
}
