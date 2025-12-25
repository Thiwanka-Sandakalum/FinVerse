/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type Member = {
    /**
     * Auth0 user id (sub)
     */
    userId: string;
    user: User;
    role: string;
    status: Member.status;
    joinedAt?: string;
};
export namespace Member {
    export enum status {
        ACTIVE = 'active',
        SUSPENDED = 'suspended',
    }
}

