/**
 * Invitation Validation Rules
 * Contains all validation logic for invitation operations
 */

import { config } from '../config/env';
import { CreateInvitationPayload } from '../types/invitation.types';

/**
 * Validate and prepare invitation payload
 */
export function validateInvitationCreate(payload: CreateInvitationPayload): CreateInvitationPayload {
    if (!payload) {
        throw new Error('Invitation payload is required');
    }

    if (!payload.invitee || !payload.invitee.email) {
        throw new Error('Invitee email is required');
    }

    if (!payload.inviter || !payload.inviter.name) {
        throw new Error('Inviter name is required');
    }

    // Valid role IDs mapping
    const ROLE_ID_MAP: Record<string, string> = {
        'member': 'rol_H3YqNbDe7HWcy2v2',
        'org_admin': 'rol_lwCVSXrdSoyEIviL',
        'super_admin': 'rol_qPupmxpQMos4IIPe'
    };

    // Convert role names to role IDs if needed
    if (payload.roles && payload.roles.length > 0) {
        payload.roles = payload.roles.map(role => {
            if (typeof role !== 'string' || role.trim().length === 0) {
                throw new Error('Each role must be a non-empty string');
            }

            // If it's already a role ID (starts with 'rol_'), keep it
            if (role.startsWith('rol_')) {
                return role;
            }

            // Otherwise, convert role name to role ID
            const roleId = ROLE_ID_MAP[role];
            if (!roleId) {
                throw new Error(`Invalid role name: ${role}. Valid roles: ${Object.keys(ROLE_ID_MAP).join(', ')}`);
            }

            return roleId;
        });
    }

    // Always set client_id from environment config
    const clientId = config.INVITATION_CLIENT_ID;

    return {
        ...payload,
        client_id: clientId,
    };
}
