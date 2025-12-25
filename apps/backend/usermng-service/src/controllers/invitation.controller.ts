/**
 * Invitation Controller
 * Handles HTTP requests and responses for organization invitation operations
 */

import { Request, Response, NextFunction } from 'express';
import * as InvitationService from '../services/invitation.service';
import { createdResponse, paginatedResponse, deletedResponse, itemResponse } from '../utils/response';

export async function createOrganizationInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const invitation = await InvitationService.createOrganizationInvitation(req.params.orgId, req.body);

        createdResponse(
            res,
            invitation,
            'Organization invitation created successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

export async function getOrganizationInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await InvitationService.getOrganizationInvitations(req.params.orgId, req.query);

        // Check if result has invitations array (paginated format from Auth0)
        if (result && typeof result === 'object' && 'invitations' in result) {
            const page = parseInt(req.query.page as string) || 0;
            const limit = result.limit || parseInt(req.query.per_page as string) || 50;
            const total = result.invitations.length;

            paginatedResponse(
                res,
                result.invitations,
                page,
                limit,
                total,
                'Organization invitations retrieved successfully',
                req.id
            );
        } else {
            // Non-paginated array response
            itemResponse(
                res,
                result,
                'Organization invitations retrieved successfully',
                req.id
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteOrganizationInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await InvitationService.deleteOrganizationInvitation(req.params.orgId, req.params.invitationId);

        deletedResponse(
            res,
            'Organization invitation deleted successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}
