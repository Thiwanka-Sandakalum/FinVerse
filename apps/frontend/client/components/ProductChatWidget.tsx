import React, { useState } from 'react';
import { sendProductChatMessage, generateSessionId } from '../services/chatService';
import { MarkdownRenderer } from '../utils/formatChatText';

/**
 * Example component showing how to integrate product-specific chat
 * Can be used in ProductDetailPage or as a standalone component
 */
interface ProductChatWidgetProps {
    productId: string;
    productName?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

export const ProductChatWidget: React.FC<ProductChatWidgetProps> = ({
    productId,
    productName
}) => {
    const [sessionId] = useState(() => generateSessionId());
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: `Hi! I can answer questions about ${productName || 'this product'}. What would you like to know?`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendProductChatMessage(sessionId, productId, input);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Product chat error:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Suggested questions based on product type
    const suggestedQuestions = [
        "What are the key benefits?",
        "What are the fees?",
        "How do I qualify?",
        "Compare this to similar products"
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 bg-brand-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-brand-700 transition-all flex items-center gap-2 z-40"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Ask about this product
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-fade-in-up">
            {/* Header */}
            <div className="bg-brand-600 p-4 rounded-t-2xl flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-white">Product Assistant</h3>
                    <p className="text-xs text-brand-100">{productName}</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-brand-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                                ? 'bg-brand-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                }`}
                        >
                            {msg.role === 'assistant' ? (
                                <MarkdownRenderer content={msg.text} />
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Suggested Questions (show only at start) */}
            {messages.length === 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInput(question)}
                            className="text-xs bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about this product..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-brand-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProductChatWidget;
