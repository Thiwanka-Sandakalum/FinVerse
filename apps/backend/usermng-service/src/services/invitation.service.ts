/**
 * Invitation Service
 * Contains business logic for organization invitation operations
 */

import * as InvitationModel from '../models/invitation.model';
import * as InvitationValidation from '../validations/invitation.validation';
import {
    OrganizationInvitation,
    OrganizationInvitationListResponse,
    CreateInvitationPayload,
} from '../types/invitation.types';

/**
 * Create organization invitation
 */
export async function createOrganizationInvitation(
    orgId: string,
    payload: CreateInvitationPayload
): Promise<OrganizationInvitation> {
    // Validate and prepare payload
    const validatedPayload = InvitationValidation.validateInvitationCreate(payload);

    return await InvitationModel.createOrganizationInvitation(orgId, validatedPayload);
}

/**
 * Get organization invitations
 */
export async function getOrganizationInvitations(
    orgId: string,
    params: any
): Promise<OrganizationInvitationListResponse | OrganizationInvitation[]> {
    return await InvitationModel.getOrganizationInvitations(orgId, params);
}

/**
 * Delete organization invitation
 */
export async function deleteOrganizationInvitation(
    orgId: string,
    invitationId: string
): Promise<void> {
    await InvitationModel.deleteOrganizationInvitation(orgId, invitationId);
}
