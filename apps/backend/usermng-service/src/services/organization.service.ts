/**
 * Organization Service
 * Contains business logic for organization operations
 * Services return pure data - NO HTTP response handling
 */

import * as OrganizationModel from '../models/organization.model';
import * as OrganizationValidation from '../validations/organization.validation';
import {
    Organization,
    OrganizationCreateRequest,
    CreateOrgResponseData,
    UpdateOrgResponseData,
} from '../types/organization.types';
import { PaginatedResponse } from '../interfaces/response';

/**
 * Create a new organization
 * @throws Error if validation fails or creation fails
 */
export async function createOrganization(org: OrganizationCreateRequest): Promise<CreateOrgResponseData> {
    // Validate and prepare data
    const validatedOrg = OrganizationValidation.validateOrganizationCreate(org);

    // Create organization using model
    const orgData = await OrganizationModel.createOrganization(validatedOrg);

    // Filter and return response data
    return {
        id: orgData.id,
        name: orgData.name,
        display_name: orgData.display_name || '',
        metadata: (orgData.metadata as Record<string, string>) || {},
    };
}

/**
 * Update an organization
 * @throws Error if validation fails or update fails
 */
export async function updateOrganization(
    id: string,
    updates: Partial<Organization>
): Promise<UpdateOrgResponseData> {
    if (!id) {
        throw new Error('Organization ID is required');
    }

    // Validate updates
    const validatedUpdates = OrganizationValidation.validateOrganizationUpdate(updates);

    // Update organization using model
    const orgData = await OrganizationModel.updateOrganization(id, validatedUpdates);

    // Filter and return response data
    return {
        id: orgData.id,
        name: orgData.name,
        display_name: orgData.display_name || '',
        metadata: (orgData.metadata as Record<string, string>) || {},
        branding: orgData.branding,
        token_quota: orgData.token_quota,
    };
}

/**
 * Delete an organization
 * @throws Error if deletion fails
 */
export async function deleteOrganization(id: string): Promise<void> {
    if (!id) {
        throw new Error('Organization ID is required');
    }
    await OrganizationModel.deleteOrganization(id);
}

/**
 * Get organization by ID
 * @throws Error if not found
 */
export async function getOrganizationById(id: string): Promise<Organization> {
    if (!id) {
        throw new Error('Organization ID is required');
    }
    return await OrganizationModel.getOrganizationById(id);
}

/**
 * Get list of organizations
 * @throws Error if retrieval fails
 */
export async function getOrganizations(params: {
    page?: number;
    limit?: number;
    include_totals?: boolean;
    from?: string;
    take?: number;
    sort?: string;
} = {}): Promise<PaginatedResponse<Organization>> {
    return await OrganizationModel.getOrganizations(params);
}
