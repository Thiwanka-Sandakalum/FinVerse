import { useState, useCallback } from 'react';
import {
    sendChatMessage,
    sendProductChatMessage,
    compareProducts,
    generateSessionId
} from '../services/chatService';

export interface UseChatReturn {
    sessionId: string;
    sendMessage: (message: string) => Promise<string>;
    sendProductMessage: (productId: string, message: string) => Promise<string>;
    compareProductsList: (productIds: string[]) => Promise<{ comparison: string; products: any[] }>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook for chat functionality
 */
export const useChatService = (): UseChatReturn => {
    const [sessionId] = useState(() => generateSessionId());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (message: string): Promise<string> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await sendChatMessage(sessionId, message);
            return response;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    const sendProductMessage = useCallback(async (
        productId: string,
        message: string
    ): Promise<string> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await sendProductChatMessage(sessionId, productId, message);
            return response;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    const compareProductsList = useCallback(async (
        productIds: string[]
    ): Promise<{ comparison: string; products: any[] }> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await compareProducts(productIds);
            return response;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        sessionId,
        sendMessage,
        sendProductMessage,
        compareProductsList,
        isLoading,
        error
    };
};
