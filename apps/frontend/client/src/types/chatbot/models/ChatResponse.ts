/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from './Message';
import type { Source } from './Source';
export type ChatResponse = {
    /**
     * AI-generated response to the user's query
     */
    answer: string;
    /**
     * Source information used to generate the response
     */
    sources: Array<Source>;
    /**
     * Conversation identifier for this chat session
     */
    conversation_id: string;
    /**
     * Type of query processing used
     */
    query_type?: ChatResponse.query_type | null;
    /**
     * Recent conversation history if requested
     */
    history?: Array<Message> | null;
};
export namespace ChatResponse {
    /**
     * Type of query processing used
     */
    export enum query_type {
        SQL = 'sql',
        VECTOR = 'vector',
        HYBRID = 'hybrid',
        UNSUPPORTED = 'unsupported',
        PRODUCT_SPECIFIC = 'product_specific',
    }
}

