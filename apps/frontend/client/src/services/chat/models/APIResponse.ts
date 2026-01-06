/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type APIResponse = {
    /**
     * Whether the request was successful
     */
    success: boolean;
    /**
     * Response message
     */
    message: string;
    /**
     * Response data (varies by endpoint)
     */
    data: {
        /**
         * AI-generated response
         */
        reply?: string;
    };
    meta: {
        /**
         * ISO 8601 timestamp of the response
         */
        timestamp: string;
    };
};

