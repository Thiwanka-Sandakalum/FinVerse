/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CleanupResponse } from '../models/CleanupResponse';
import type { ConversationHistoryResponse } from '../models/ConversationHistoryResponse';
import type { ConversationsResponse } from '../models/ConversationsResponse';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatHistoryService {
    /**
     * Get user conversations
     * Retrieve a list of chat conversations for the current user
     * @param limit Maximum number of conversations to return
     * @returns ConversationsResponse List of user conversations
     * @throws ApiError
     */
    public static getConversations(
        limit: number = 100,
    ): CancelablePromise<ConversationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/conversations',
            query: {
                'limit': limit,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get conversation history
     * Retrieve message history for a specific conversation
     * @param conversationId Unique identifier for the conversation
     * @param limit Maximum number of messages to return
     * @returns ConversationHistoryResponse Conversation message history
     * @throws ApiError
     */
    public static getConversationsHistory(
        conversationId: string,
        limit: number = 20,
    ): CancelablePromise<ConversationHistoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/conversations/{conversation_id}/history',
            path: {
                'conversation_id': conversationId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Conversation not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete conversation
     * Delete a conversation and all its messages
     * @param conversationId Unique identifier for the conversation
     * @returns SuccessResponse Conversation deleted successfully
     * @throws ApiError
     */
    public static deleteConversations(
        conversationId: string,
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/conversations/{conversation_id}',
            path: {
                'conversation_id': conversationId,
            },
            errors: {
                404: `Conversation not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Cleanup old conversations
     * Delete conversations older than specified number of days
     * @param days Number of days to keep conversations (older ones will be deleted)
     * @returns CleanupResponse Cleanup completed
     * @throws ApiError
     */
    public static postConversationsCleanup(
        days: number = 30,
    ): CancelablePromise<CleanupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/conversations/cleanup',
            query: {
                'days': days,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
