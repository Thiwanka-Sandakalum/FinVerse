import { ChatMessage } from '../types';

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const STORAGE_KEY = 'finverse_chat_sessions';
const MAX_SESSIONS = 50; // Limit number of stored sessions

/**
 * Get all chat sessions from localStorage
 */
export const getAllChatSessions = (): ChatSession[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const sessions = JSON.parse(stored);
        // Convert date strings back to Date objects
        return sessions.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }))
        }));
    } catch (error) {
        console.error('Error loading chat sessions:', error);
        return [];
    }
};

/**
 * Get a single chat session by ID
 */
export const getChatSession = (sessionId: string): ChatSession | null => {
    const sessions = getAllChatSessions();
    return sessions.find(s => s.id === sessionId) || null;
};

/**
 * Save or update a chat session
 */
export const saveChatSession = (session: ChatSession): void => {
    try {
        let sessions = getAllChatSessions();

        // Check if session already exists
        const existingIndex = sessions.findIndex(s => s.id === session.id);

        if (existingIndex >= 0) {
            // Update existing session
            sessions[existingIndex] = {
                ...session,
                updatedAt: new Date()
            };
        } else {
            // Add new session
            sessions.unshift({
                ...session,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Limit number of sessions
            if (sessions.length > MAX_SESSIONS) {
                sessions = sessions.slice(0, MAX_SESSIONS);
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Error saving chat session:', error);
    }
};

/**
 * Delete a chat session
 */
export const deleteChatSession = (sessionId: string): void => {
    try {
        const sessions = getAllChatSessions();
        const filtered = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting chat session:', error);
    }
};

/**
 * Delete all chat sessions
 */
export const deleteAllChatSessions = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error deleting all chat sessions:', error);
    }
};

/**
 * Generate a chat title from the first user message
 */
export const generateChatTitle = (messages: ChatMessage[]): string => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Conversation';

    // Take first 50 characters of the message
    let title = firstUserMessage.text.substring(0, 50);
    if (firstUserMessage.text.length > 50) {
        title += '...';
    }

    return title;
};

/**
 * Get chat sessions grouped by date
 */
export const getChatSessionsGrouped = () => {
    const sessions = getAllChatSessions();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    return {
        today: sessions.filter(s => s.updatedAt >= today),
        yesterday: sessions.filter(s => s.updatedAt >= yesterday && s.updatedAt < today),
        lastWeek: sessions.filter(s => s.updatedAt >= weekAgo && s.updatedAt < yesterday),
        lastMonth: sessions.filter(s => s.updatedAt >= monthAgo && s.updatedAt < weekAgo),
        older: sessions.filter(s => s.updatedAt < monthAgo)
    };
};
