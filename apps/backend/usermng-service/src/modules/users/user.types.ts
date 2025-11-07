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
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
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

export interface Auth0UserListResponse {
    start?: number;
    limit?: number;
    length?: number;
    total?: number;
    users: Auth0User[];
}
