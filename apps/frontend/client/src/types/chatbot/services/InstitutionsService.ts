/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Institution } from '../models/Institution';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstitutionsService {
    /**
     * Get all financial institutions
     * Retrieve a list of all financial institutions in the system
     * @returns Institution List of financial institutions
     * @throws ApiError
     */
    public static getInstitutions(): CancelablePromise<Array<Institution>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/institutions',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
