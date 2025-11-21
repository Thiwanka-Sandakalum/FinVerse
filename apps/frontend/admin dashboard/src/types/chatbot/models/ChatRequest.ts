/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatRequest = {
    /**
     * The user's financial query or question
     */
    query: string;
    /**
     * Optional conversation ID to maintain chat context
     */
    conversation_id?: string | null;
    /**
     * Whether to include conversation history in the response
     */
    include_history?: boolean;
};

