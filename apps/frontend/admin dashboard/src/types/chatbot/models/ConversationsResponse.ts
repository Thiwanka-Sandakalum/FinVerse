/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConversationsResponse = {
    status?: ConversationsResponse.status;
    conversations?: Array<{
        id?: string;
        created_at?: string;
        last_message?: string;
        message_count?: number;
    }>;
};
export namespace ConversationsResponse {
    export enum status {
        SUCCESS = 'success',
    }
}

