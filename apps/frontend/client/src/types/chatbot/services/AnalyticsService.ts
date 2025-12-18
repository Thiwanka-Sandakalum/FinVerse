/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatsResponse } from '../models/StatsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Get query statistics
     * Retrieve statistics about processed queries and system usage
     * @returns StatsResponse Query statistics
     * @throws ApiError
     */
    public static getStats(): CancelablePromise<StatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stats',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
