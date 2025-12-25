/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { Pagination } from '../models/Pagination';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationsService {
    /**
     * Create a new organization
     * Create a new organization. Creates Auth0 Organization if using Auth0 Organizations.
     * Access: super_admin (permission: admin:manage or org:write).
     *
     * @param requestBody
     * @returns Organization Organization created
     * @throws ApiError
     */
    public static postOrgs(
        requestBody: {
            /**
             * Organization name
             */
            name: string;
            /**
             * Display name for the organization
             */
            display_name?: string;
            metadata: {
                description?: string;
                industryType?: 'Bank' | 'Insurance' | 'Fintech' | 'CreditUnion' | 'InvestmentFirm' | 'PaymentProvider' | 'Microfinance' | 'LeasingCompany' | 'FinanceCompany' | 'StockBroker' | 'UnitTrust' | 'PawnBroker' | 'MoneyTransfer' | 'DevelopmentBank' | 'CooperativeSociety' | 'InsuranceBroker' | 'Other';
                registrationNumber?: string;
                country?: string;
                region?: string;
                headquartersAddress?: string;
                contactEmail?: string;
                contactPhone?: string;
                website?: string;
                establishedYear?: string;
                supportedProducts?: Array<'SavingsAccount' | 'CurrentAccount' | 'FixedDeposit' | 'PersonalLoan' | 'HomeLoan' | 'Leasing' | 'Microfinance' | 'CreditCard' | 'DebitCard' | 'Insurance' | 'LifeInsurance' | 'GeneralInsurance' | 'Investment' | 'StockTrading' | 'UnitTrust' | 'Remittance' | 'MobileBanking' | 'InternetBanking' | 'PaymentGateway' | 'PawnBroking' | 'Other'>;
                numberOfBranches?: string;
                numberOfEmployees?: string;
                logoUrl?: string;
                swiftCode?: string;
            };
        },
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orgs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden (requires super_admin)`,
            },
        });
    }
    /**
     * List organizations
     * List all organizations with pagination and optional filters.
     * Access: super_admin (permission: admin:manage or org:read).
     *
     * @param page
     * @param limit
     * @param q Search term for org name
     * @returns any Paginated list of organizations
     * @throws ApiError
     */
    public static getOrgs(
        page: number = 1,
        limit: number = 25,
        q?: string,
    ): CancelablePromise<{
        pagination?: Pagination;
        items?: Array<Organization>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs',
            query: {
                'page': page,
                'limit': limit,
                'q': q,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get organization details
     * Get organization details (name, members, roles, settings). Access: org_admin, super_admin (org:read).
     * @param orgId
     * @returns Organization Organization details
     * @throws ApiError
     */
    public static getOrgs1(
        orgId: string,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            errors: {
                403: `Forbidden`,
                404: `Organization not found`,
            },
        });
    }
    /**
     * Update organization
     * Update organization info (name, metadata). Access: org_admin (org:update).
     * @param orgId
     * @param requestBody
     * @returns Organization Updated organization
     * @throws ApiError
     */
    public static putOrgs(
        orgId: string,
        requestBody: {
            name?: string;
            metadata?: Record<string, any>;
        },
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                403: `Forbidden`,
                404: `Not found`,
            },
        });
    }
    /**
     * Delete or deactivate an organization
     * Delete or deactivate organization. Access: super_admin (admin:manage).
     * @param orgId
     * @returns void
     * @throws ApiError
     */
    public static deleteOrgs(
        orgId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orgs/{orgId}',
            path: {
                'orgId': orgId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
}
