/**
 * Role Type Definitions
 */

import { PaginatedResponse } from '../interfaces/response';

export interface Auth0Role {
    id: string;
    name: string;
    description?: string;
}

export interface Auth0RoleListResponse {
    total?: number;
    roles: Auth0Role[];
}

export type RoleListResponse = PaginatedResponse<Auth0Role>;
