/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IngestResponse } from '../models/IngestResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DataManagementService {
    /**
     * Ingest product data into vector store
     * Ingest all financial product data from the database into the vector store for semantic search capabilities.
     * This endpoint is typically used for data initialization and updates.
     *
     * @returns IngestResponse Data ingestion successful
     * @throws ApiError
     */
    public static postIngest(): CancelablePromise<IngestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ingest',
            errors: {
                401: `Unauthorized`,
                500: `Internal server error`,
            },
        });
    }
}
