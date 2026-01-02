/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaginatedResponse = {
    data: Array<Record<string, any>>;
    meta: {
        /**
         * Total number of items
         */
        total?: number;
        /**
         * Number of items per page
         */
        limit?: number;
        /**
         * Offset of items
         */
        offset?: number;
        /**
         * Response timestamp (ISO8601)
         */
        timestamp?: string;
    };
};

