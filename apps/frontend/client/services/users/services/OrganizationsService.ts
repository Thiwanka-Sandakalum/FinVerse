/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiSuccessResponse } from '../models/ApiSuccessResponse';
import type { OrganizationMetadata } from '../models/OrganizationMetadata';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationsService {
    /**
     * Create organization
     * Create a new financial institution organization (requires super_admin role)
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Organization created successfully
     * @throws ApiError
     */
    public static createOrganization(
        requestBody: {
            name: string;
            display_name?: string;
            metadata: OrganizationMetadata;
        },

    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs',
            headers: {

            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * List organizations
     * Get paginated list of all organizations (requires super_admin role)
     * @param xRequestId Optional request ID for distributed tracing
     * @param page Page number (0-indexed)
     * @param perPage Items per page
     * @param q Search term
     * @returns any Organizations retrieved successfully
     * @throws ApiError
     */
    public static listOrganizations(

        page?: number,
        perPage: number = 50,
        q?: string,
    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs',
            headers: {

            },
            query: {
                'page': page,
                'per_page': perPage,
                'q': q,
            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Organization onboarding (orchestrated)
     * Orchestrates organization onboarding: creates org, adds user as member, assigns org_admin role, assigns global user role, and updates user metadata. Replaces Auth0 Actions onboarding.
     *
     * @param userId Auth0 user ID of the onboarding user
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Onboarding completed successfully
     * @throws ApiError
     */
    public static onboardOrganization(
        userId: string,
        requestBody: {
            /**
             * Name of the company/organization
             */
            companyName: string;
            /**
             * Optional organization metadata
             */
            metadata?: Record<string, any>;
        },

    ): CancelablePromise<{
        success?: boolean;
        orgId?: string;
        userId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs/onboard',
            headers: {

                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get organization
     * Retrieve organization details by ID
     * @param orgId Organization identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Organization retrieved successfully
     * @throws ApiError
     */
    public static getOrganization(
        orgId: string,

    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            headers: {

            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update organization
     * Update organization details (requires org_admin role)
     * @param orgId Organization identifier
     * @param requestBody
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Organization updated successfully
     * @throws ApiError
     */
    public static updateOrganization(
        orgId: string,
        requestBody: {
            display_name?: string;
            metadata?: Record<string, any>;
        },

    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            headers: {

            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete organization
     * Delete an organization (requires super_admin role)
     * @param orgId Organization identifier
     * @param xRequestId Optional request ID for distributed tracing
     * @returns any Organization deleted successfully
     * @throws ApiError
     */
    public static deleteOrganization(
        orgId: string,

    ): CancelablePromise<ApiSuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            headers: {

            },
            errors: {
                401: `Missing or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
                500: `Internal server error`,
            },
        });
    }
}
