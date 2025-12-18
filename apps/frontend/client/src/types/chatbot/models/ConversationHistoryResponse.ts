/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from './Message';
export type ConversationHistoryResponse = {
    status?: ConversationHistoryResponse.status;
    conversation_id?: string;
    messages?: Array<Message>;
};
export namespace ConversationHistoryResponse {
    export enum status {
        SUCCESS = 'success',
    }
}

