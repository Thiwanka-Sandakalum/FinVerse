import { PaginatedResponse } from '../../interfaces/response';

export interface OrganizationMember {
    user_id: string;
    picture?: string;
    name?: string;
    email?: string;
    roles?: OrganizationMemberRole[];
}

export interface OrganizationMemberRole {
    id: string;
    name: string;
    description?: string;
}

export type OrganizationMemberListResponse = PaginatedResponse<OrganizationMember>;
export type OrganizationMemberRolesResponse = PaginatedResponse<OrganizationMemberRole>;
