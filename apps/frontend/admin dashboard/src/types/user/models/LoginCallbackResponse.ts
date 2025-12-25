/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginCallbackResponse = {
    /**
     * Indicates if the login callback was processed successfully
     */
    success: boolean;
    /**
     * Enhanced user profile with organization and role information
     */
    user?: {
        /**
         * Auth0 user identifier
         */
        user_id?: string;
        email?: string;
        name?: string;
        nickname?: string;
        picture?: string;
        email_verified?: boolean;
        last_login?: string;
        app_metadata?: {
            role?: LoginCallbackResponse.role;
            org_id?: string;
            permissions?: Array<string>;
        };
        organization?: {
            id?: string;
            name?: string;
            display_name?: string;
        };
    };
    /**
     * Success or error message
     */
    message: string;
};
export namespace LoginCallbackResponse {
    export enum role {
        SUPER_ADMIN = 'super_admin',
        ORG_ADMIN = 'org_admin',
        MEMBER = 'member',
    }
}

