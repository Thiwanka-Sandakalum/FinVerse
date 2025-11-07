import * as InvitationService from './invitation.service';
import { Request, Response, NextFunction } from 'express';

export async function createOrganizationInvitation(req: Request, res: Response, next: NextFunction) {
    try {
        const invitation = await InvitationService.createOrganizationInvitation(req.params.orgId, req.body);
        res.status(201).json(invitation);
    } catch (error) {
        next(error);
    }
}

export async function getOrganizationInvitations(req: Request, res: Response, next: NextFunction) {
    try {
        const invitations = await InvitationService.getOrganizationInvitations(req.params.orgId, req.query);
        res.json(invitations);
    } catch (error) {
        next(error);
    }
}

export async function deleteOrganizationInvitation(req: Request, res: Response, next: NextFunction) {
    try {
        await InvitationService.deleteOrganizationInvitation(req.params.orgId, req.params.invitationId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
