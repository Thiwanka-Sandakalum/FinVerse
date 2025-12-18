/**
 * Invitation Type Definitions
 */

export interface OrganizationInvitation {
    id: string;
    organization_id: string;
    inviter: { name: string };
    invitee: { email: string };
    invitation_url: string;
    created_at: string;
    expires_at: string;
    client_id: string;
    connection_id?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    roles?: string[];
    ticket_id?: string;
}

export interface OrganizationInvitationListResponse {
    start?: number;
    limit?: number;
    invitations: OrganizationInvitation[];
}

export interface CreateInvitationPayload {
    inviter: { name: string };
    invitee: { email: string };
    client_id?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    roles?: string[];
    send_invitation_email?: boolean;
}
