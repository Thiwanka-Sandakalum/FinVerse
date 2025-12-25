/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponse = {
    status?: UserResponse.status;
    /**
     * Unique user identifier
     */
    user_id?: string;
    /**
     * Authentication status
     */
    is_authenticated?: boolean;
};
export namespace UserResponse {
    export enum status {
        SUCCESS = 'success',
    }
}

