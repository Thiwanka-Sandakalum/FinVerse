export interface Auth0Role {
    id: string;
    name: string;
    description?: string;
}

export interface Auth0RoleListResponse {
    start?: number;
    limit?: number;
    total?: number;
    roles: Auth0Role[];
}
