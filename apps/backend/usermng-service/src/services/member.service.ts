/**
 * Member Service
 * Contains business logic for organization member operations
 */

import * as MemberModel from '../models/member.model';
import {
    OrganizationMemberListResponse,
    OrganizationMemberRolesResponse,
} from '../types/member.types';

/**
 * Get organization members
 */
export async function getOrganizationMembers(
    orgId: string,
    params: any
): Promise<OrganizationMemberListResponse> {
    return await MemberModel.getOrganizationMembers(orgId, params);
}

/**
 * Delete organization members
 */
export async function deleteOrganizationMembers(
    orgId: string,
    members: string[]
): Promise<void> {
    await MemberModel.deleteOrganizationMembers(orgId, members);
}

/**
 * Get organization member roles
 */
export async function getOrganizationMemberRoles(
    orgId: string,
    userId: string,
    params: any
): Promise<OrganizationMemberRolesResponse> {
    return await MemberModel.getOrganizationMemberRoles(orgId, userId, params);
}

/**
 * Assign roles to organization member
 */
export async function assignOrganizationMemberRoles(
    orgId: string,
    userId: string,
    roles: string[]
): Promise<void> {
    await MemberModel.assignOrganizationMemberRoles(orgId, userId, roles);
}
