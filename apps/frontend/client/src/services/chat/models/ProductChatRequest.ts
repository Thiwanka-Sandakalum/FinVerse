/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductChatRequest = {
    /**
     * Unique identifier for the chat session
     */
    sessionId?: string;
    /**
     * Unique identifier of the product to chat about
     */
    productId: string;
    /**
     * User's question about the product
     */
    message: string;
};

