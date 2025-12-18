/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizationInvitation = {
    id: string;
    organization_id: string;
    inviter?: {
        name?: string;
    };
    invitee: {
        email?: string;
    };
    invitation_url?: string;
    created_at?: string;
    expires_at?: string;
    client_id?: string;
    connection_id?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    roles?: Array<string>;
    ticket_id?: string;
};

