/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Error = {
    /**
     * Error code identifier
     */
    code: string;
    /**
     * Optional array of error details
     */
    details: Array<{
        /**
         * Field name related to the error
         */
        field?: string;
        /**
         * Error message for the field
         */
        message?: string;
        /**
         * Error code for the field
         */
        code?: string;
    }>;
};

