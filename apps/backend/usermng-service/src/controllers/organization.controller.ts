/**
 * Organization Controller
 * Handles HTTP requests and responses for organization operations
 * Uses standardized API response envelope
 */

import { Request, Response, NextFunction } from 'express';
import * as OrganizationService from '../services/organization.service';
import {
    createdResponse,
    updatedResponse,
    deletedResponse,
    itemResponse,
    paginatedResponse
} from '../utils/response';

/**
 * Create a new organization
 * POST /orgs
 */
export async function createOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization = await OrganizationService.createOrganization(req.body);
        createdResponse(
            res,
            organization,
            'Organization created successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Get all organizations with pagination
 * GET /orgs
 */
export async function getOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { items, pagination } = await OrganizationService.getOrganizations(req.query);
        paginatedResponse(
            res,
            items,
            pagination.page,
            pagination.limit,
            pagination.total,
            'Organizations retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Get organization by ID
 * GET /orgs/:id
 */
export async function getOrganizationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization = await OrganizationService.getOrganizationById(req.params.id);
        itemResponse(
            res,
            organization,
            'Organization retrieved successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Update organization by ID
 * PUT /orgs/:id
 */
export async function updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const organization = await OrganizationService.updateOrganization(req.params.id, req.body);
        updatedResponse(
            res,
            organization,
            'Organization updated successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}

/**
 * Delete organization by ID
 * DELETE /orgs/:id
 */
export async function deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await OrganizationService.deleteOrganization(req.params.id);
        deletedResponse(
            res,
            'Organization deleted successfully',
            req.id
        );
    } catch (error) {
        next(error);
    }
}
