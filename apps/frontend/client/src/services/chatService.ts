import { ChatService } from './chat/services/ChatService';
import { ProductChatService } from './chat/services/ProductChatService';
import { ProductComparisonService } from './chat/services/ProductComparisonService';

/**
 * Send a general chat message
 */
export const sendChatMessage = async (
    sessionId: string,
    message: string
): Promise<string> => {
    try {
        const response = await ChatService.chat({
            sessionId,
            message
        });

        if (response.success && response.data?.reply) {
            return response.data.reply;
        }

        return response.message || 'Sorry, I could not process your request.';
    } catch (error) {
        console.error('Chat error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
};

/**
 * Send a product-specific chat message
 */
export const sendProductChatMessage = async (
    sessionId: string,
    productId: string,
    message: string
): Promise<string> => {
    try {
        const response = await ProductChatService.productChat({
            sessionId,
            productId,
            message
        });

        if (response.success && response.data?.reply) {
            return response.data.reply;
        }

        return response.message || 'Sorry, I could not process your request.';
    } catch (error) {
        console.error('Product chat error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
};

/**
 * Compare multiple products
 */
export const compareProducts = async (
    productIds: string[]
): Promise<{ comparison: string; products: any[] }> => {
    try {
        const response = await ProductComparisonService.compareProducts({
            productIds
        });

        return {
            comparison: response.data?.summary || 'Comparison not available.',
            products: response.data?.products || []
        };
    } catch (error) {
        console.error('Product comparison error:', error);
        throw new Error('Failed to compare products. Please try again.');
    }
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
