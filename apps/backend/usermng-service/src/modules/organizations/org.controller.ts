import * as OrgService from './org.service';
import { Request, Response, NextFunction } from 'express';
import { sendItemResponse, sendPaginatedResponse, sendNoContentResponse } from '../../utils/response';

export async function createOrganization(req: Request, res: Response, next: NextFunction) {
    try {
        const org = await OrgService.createOrganization(req.body);
        sendItemResponse(res, org);
    } catch (error) {
        next(error);
    }
}

export async function getOrganizations(req: Request, res: Response, next: NextFunction) {
    try {
        const { items, pagination } = await OrgService.getOrganizations(req.query);
        sendPaginatedResponse(res, items, pagination.page, pagination.limit, pagination.total);
    } catch (error) {
        next(error);
    }
}

export async function getOrganizationById(req: Request, res: Response, next: NextFunction) {
    try {
        const org = await OrgService.getOrganizationById(req.params.id);
        sendItemResponse(res, org);
    } catch (error) {
        next(error);
    }
}

export async function updateOrganization(req: Request, res: Response, next: NextFunction) {
    try {
        const org = await OrgService.updateOrganization(req.params.id, req.body);
        sendItemResponse(res, org);
    } catch (error) {
        next(error);
    }
}

export async function deleteOrganization(req: Request, res: Response, next: NextFunction) {
    try {
        await OrgService.deleteOrganization(req.params.id);
        sendNoContentResponse(res);
    } catch (error) {
        next(error);
    }
}
