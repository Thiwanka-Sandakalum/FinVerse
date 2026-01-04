/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorResponse = {
    success: boolean;
    /**
     * Error message
     */
    message: string;
    error?: {
        code?: string;
        details?: string;
    };
};

