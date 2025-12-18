/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Role } from '../models/Role';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RolesService {
    /**
     * List all roles in the system
     * List roles (paginated). Access - super_admin (permission - admin-manage).
     *
     * @param page
     * @param perPage
     * @param nameFilter Filter roles by name
     * @returns any List of roles
     * @throws ApiError
     */
    public static getRoles(
        page: number = 1,
        perPage: number = 25,
        nameFilter?: string,
    ): CancelablePromise<{
        start?: number;
        limit?: number;
        total?: number;
        roles?: Array<Role>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles',
            query: {
                'page': page,
                'per_page': perPage,
                'name_filter': nameFilter,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }
}
