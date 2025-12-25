/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductChatRequest = {
    /**
     * The user's question about the specific product
     */
    query: string;
    /**
     * Unique identifier for the financial product
     */
    product_id: string;
    /**
     * Optional conversation ID to maintain chat context
     */
    conversation_id?: string | null;
    /**
     * Whether to include conversation history in the response
     */
    include_history?: boolean;
};

