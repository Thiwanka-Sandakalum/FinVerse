/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
export type ApiErrorResponse = {
    success: boolean;
    message: string;
    error: {
        code: ApiErrorResponse.code;
        details?: Array<{
            field?: string;
            message?: string;
        }>;
    };
    meta: ResponseMeta;
};
export namespace ApiErrorResponse {
    export enum code {
        VALIDATION_ERROR = 'VALIDATION_ERROR',
        UNAUTHORIZED = 'UNAUTHORIZED',
        FORBIDDEN = 'FORBIDDEN',
        NOT_FOUND = 'NOT_FOUND',
        CONFLICT = 'CONFLICT',
        INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    }
}

