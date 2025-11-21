export interface Auth0User {
    user_id: string;
    email?: string;
    email_verified?: boolean;
    username?: string;
    phone_number?: string;
    phone_verified?: boolean;
    created_at?: string;
    updated_at?: string;
    identities?: any[];
    app_metadata?: UserAppMetadata;
    user_metadata?: UserMetadata;
    picture?: string;
    name?: string;
    nickname?: string;
    multifactor?: string[];
    last_ip?: string;
    last_login?: string;
    logins_count?: number;
    blocked?: boolean;
    given_name?: string;
    family_name?: string;
}

export interface UserMetadata {
    isCompany?: boolean;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
}

export interface UserAppMetadata {
    org_id?: string;
    role?: 'org_admin' | 'member';
    permissions?: string[];
    [key: string]: any;
}

export interface Auth0UserListResponse {
    start?: number;
    limit?: number;
    length?: number;
    total?: number;
    users: Auth0User[];
}

export interface EnhancedUser extends Auth0User {
    organization?: {
        id: string;
        name: string;
        display_name?: string;
    };
}

export interface EnhancedUserListResponse {
    start?: number;
    limit?: number;
    length?: number;
    total?: number;
    users: EnhancedUser[];
}

export interface LoginCallbackRequest {
    token: string;
}

export interface LoginCallbackResponse {
    success: boolean;
    user: EnhancedUser;
    message: string;
}
