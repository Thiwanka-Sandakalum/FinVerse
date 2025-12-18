import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Stack,
    TextInput,
    ActionIcon,
    Paper,
    Text,
    Group,
    Avatar,
    ScrollArea,
    Loader,
    Badge,
    Card,
    Button,
    Divider,
} from '@mantine/core';
import { IconSend, IconRobot, IconUser, IconMaximize, IconMinimize } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { useComparison } from '../context/ComparisonContext';
import { ProductChatService, ProductComparisonService, ChatService } from '../types/chatbot';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
    isMaximized?: boolean;
    onToggleMaximize?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isMaximized = false, onToggleMaximize }) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { comparisonProducts } = useComparison();
    const location = useLocation();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Extract product ID from route if we're on a product detail page
    const isProductDetailPage = location.pathname.startsWith('/product/');
    const currentProductId = isProductDetailPage ? location.pathname.split('/product/')[1] : null;

    // Local functions to replace useStore actions
    const addChatMessage = (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    };

    const clearChatMessages = () => {
        setMessages([]);
    };

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}-user`,
            content: inputValue.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        addChatMessage(userMessage);
        setInputValue('');
        setIsLoading(true);

        try {
            let response: any = null;

            // Check if we're on a product detail page
            if (currentProductId) {
                // Use ProductChatService for single product queries
                response = await ProductChatService.postProductChat({
                    query: userMessage.content,
                    product_id: currentProductId,
                    conversation_id: conversationId,
                    include_history: false
                });
            } else if (comparisonProducts.length >= 2) {
                // Use ProductComparisonService for multiple product comparison
                response = await ProductComparisonService.postCompareProducts({
                    product_ids: comparisonProducts.map(p => p.id),
                    conversation_id: conversationId
                });
            } else {
                // Use ChatService for general queries
                response = await ChatService.postChat({
                    query: userMessage.content,
                    conversation_id: conversationId,
                    include_history: false
                });
            }

            // Handle different response types
            let botContent = '';
            let newConversationId = conversationId;
            let productSources: any[] = [];

            if (response) {
                if (response.answer) {
                    // ProductChatService or ChatService response
                    botContent = response.answer;
                    newConversationId = response.conversation_id;
                    productSources = response.sources || [];
                } else if (response.summary) {
                    // ProductComparisonService response
                    botContent = response.summary;
                    newConversationId = response.conversation_id;
                    productSources = response.products || [];
                } else if (response.data) {
                    // Fallback for old API response
                    botContent = response.data;
                }

                if (botContent) {
                    // Update conversation ID for future messages
                    if (newConversationId && newConversationId !== conversationId) {
                        setConversationId(newConversationId);
                    }

                    // Create product references from sources or comparison products
                    let productReferences: any[] = [];
                    if (productSources.length > 0) {
                        // Use sources from AI response
                        productReferences = productSources
                            .filter(source => source.product_id && source.product_name && source.product_name !== "aaaaaaaaaaaaaaaaaa")
                            .map(source => ({
                                id: source.product_id,
                                name: source.product_name,
                                provider: 'BOC Bank', // Default for now, could be extracted from response
                                type: source.product_name.includes('Credit Card') ? 'Credit Card' : 'Personal Loan',
                                rating: 4.5, // Default rating, could be enhanced
                                relevance: source.relevance
                            }));
                    } else if (comparisonProducts.length > 0) {
                        // Fallback to comparison products
                        productReferences = comparisonProducts.map((p: any) => ({
                            id: p.id,
                            name: p.name || '',
                            provider: p.provider || '',
                            type: p.type || '',
                            logo: p.logo,
                            description: p.description || '',
                            interestRate: p.interestRate,
                            annualFee: p.annualFee,
                            rewards: p.rewards,
                            cashback: p.cashback,
                            eligibility: p.eligibility,
                            features: p.features || [],
                            rating: p.rating || 0,
                            tags: p.tags || [],
                            fees: p.fees,
                            terms: p.terms,
                            minAmount: p.minAmount
                        }));
                    }

                    const botMessage: ChatMessage = {
                        id: `msg-${Date.now()}-bot`,
                        content: botContent,
                        sender: 'bot',
                        timestamp: new Date(),
                        productReferences: productReferences.length > 0 ? productReferences : undefined,
                    };

                    addChatMessage(botMessage);
                } else {
                    throw new Error('No valid response received');
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            notifications.show({
                title: 'Chat Error',
                message: 'Failed to send message. Please check your connection.',
                color: 'red',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageContent = (content: string) => {
        // Enhanced markdown-like formatting for better UX
        return content
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--mantine-color-finBlue-7);">$1</strong>')
            // Italic text
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Headers (###)
            .replace(/### (.*?)(?=\n|$)/g, '<h3 style="color: var(--mantine-color-finGreen-6); margin: 16px 0 8px 0; font-size: 1.1rem; font-weight: 600;">$1</h3>')
            // Subheaders (**)
            .replace(/\*\*(\d+\.\s.*?)\*\*/g, '<h4 style="color: var(--mantine-color-finBlue-6); margin: 12px 0 6px 0; font-weight: 600;">$1</h4>')
            // Bullet points
            .replace(/^\*\s+(.+?)$/gm, '<div style="margin: 4px 0; padding-left: 12px; position: relative;"><span style="position: absolute; left: 0; color: var(--mantine-color-finGreen-5);">•</span>$1</div>')
            // Links - extract URLs and make them clickable
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--mantine-color-finBlue-6); text-decoration: none; border-bottom: 1px dotted var(--mantine-color-finBlue-6);">$1 ↗</a>')
            // Line breaks
            .replace(/\n\n/g, '<br /><br />')
            .replace(/\n/g, '<br />');
    };

    return (
        <Stack h="100%" gap={0}>
            {/* Chat Header */}
            <Group justify="space-between" p="md" pb="xs">
                <Group gap="sm">
                    <Avatar color="finBlue" size="sm">
                        <IconRobot size={16} />
                    </Avatar>
                    <div>
                        <Text size="sm" fw={500}>
                            FinVerse AI Assistant
                        </Text>
                        <Text size="xs" c="dimmed">
                            Ask me about financial products
                        </Text>
                    </div>
                </Group>
                <Group gap="xs">
                    {messages.length > 0 && (
                        <Button variant="subtle" size="xs" onClick={clearChatMessages}>
                            Clear Chat
                        </Button>
                    )}
                    {onToggleMaximize && (
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={onToggleMaximize}
                            aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
                        >
                            {isMaximized ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
                        </ActionIcon>
                    )}
                </Group>
            </Group>

            {/* Context Info */}
            {comparisonProducts.length > 0 && (
                <Paper p="sm" m="md" mt={0} bg="finBlue.0">
                    <Text size="xs" fw={500} mb="xs">
                        Comparing {comparisonProducts.length} products:
                    </Text>
                    <Group gap="xs">
                        {comparisonProducts.map((product) => (
                            <Badge key={product.id} size="xs" variant="light">
                                {product.name}
                            </Badge>
                        ))}
                    </Group>
                </Paper>
            )}

            <Divider />

            {/* Messages Area */}
            <ScrollArea
                flex={1}
                p={isMaximized ? "xl" : "md"}
                viewportRef={scrollAreaRef}
                scrollbars="y"
                style={{
                    backgroundColor: isMaximized ? '#fafafa' : 'transparent'
                }}
            >
                <Stack gap={isMaximized ? "xl" : "md"} style={{ maxWidth: '100%' }}>
                    {messages.length === 0 && (
                        <Paper
                            p={isMaximized ? "xl" : "lg"}
                            bg="gradient-to-br from-finBlue-0 to-finGreen-0"
                            ta="center"
                            radius="lg"
                            style={{
                                border: '2px dashed var(--mantine-color-finBlue-3)',
                                background: 'linear-gradient(135deg, var(--mantine-color-finBlue-0) 0%, var(--mantine-color-finGreen-0) 100%)'
                            }}
                        >
                            <IconRobot size={isMaximized ? 48 : 32} color="var(--mantine-color-finBlue-6)" />
                            <Text size={isMaximized ? "lg" : "sm"} mt="sm" fw={600} c="finBlue.7">
                                🤖 Welcome to FinVerse AI Assistant!
                            </Text>
                            <Text size={isMaximized ? "md" : "xs"} c="dimmed" mt="xs" style={{ lineHeight: 1.6 }}>
                                {isMaximized
                                    ? "I'm here to help you with financial products, comparisons, and personalized recommendations. Ask me anything about loans, credit cards, savings accounts, and more!"
                                    : "Ask me about products, compare options, or get personalized recommendations"
                                }
                            </Text>
                            {isMaximized && (
                                <Group justify="center" mt="md" gap="xs">
                                    <Badge variant="light" color="finBlue">💳 Credit Cards</Badge>
                                    <Badge variant="light" color="finGreen">🏦 Personal Loans</Badge>
                                    <Badge variant="light" color="yellow">💰 Savings Accounts</Badge>
                                </Group>
                            )}
                        </Paper>
                    )}

                    {messages.map((message) => (
                        <Group key={message.id} gap={isMaximized ? "md" : "sm"} align="flex-start">
                            <Avatar
                                color={message.sender === 'user' ? 'finGreen' : 'finBlue'}
                                size={isMaximized ? "md" : "sm"}
                                mt={4}
                                style={{
                                    border: '2px solid',
                                    borderColor: message.sender === 'user'
                                        ? 'var(--mantine-color-finGreen-3)'
                                        : 'var(--mantine-color-finBlue-3)'
                                }}
                            >
                                {message.sender === 'user' ? <IconUser size={isMaximized ? 20 : 16} /> : <IconRobot size={isMaximized ? 20 : 16} />}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Paper
                                    p={isMaximized ? "lg" : "md"}
                                    bg={message.sender === 'user' ? 'finGreen.1' : 'gray.0'}
                                    style={{
                                        maxWidth: isMaximized ? '95%' : '85%',
                                        width: message.sender === 'bot' && isMaximized ? '100%' : 'auto'
                                    }}
                                    radius="md"
                                >
                                    <div
                                        style={{
                                            fontSize: isMaximized ? '15px' : '14px',
                                            lineHeight: '1.7',
                                            fontFamily: 'var(--mantine-font-family)',
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: formatMessageContent(message.content),
                                        }}
                                    />
                                </Paper>

                                {/* Product References */}
                                {message.productReferences && message.productReferences.length > 0 && (
                                    <Stack gap={isMaximized ? "md" : "xs"} mt="sm"
                                        style={{
                                            maxWidth: isMaximized ? '95%' : '85%',
                                            width: '100%'
                                        }}>
                                        <Text size="xs" fw={500} c="finBlue" mb={isMaximized ? "sm" : "xs"}>
                                            📋 Referenced Products ({message.productReferences.length})
                                        </Text>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: isMaximized ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
                                            gap: isMaximized ? '16px' : '8px',
                                            width: '100%'
                                        }}>
                                            {message.productReferences.map((product, index) => (
                                                <Card
                                                    key={product.id || index}
                                                    p={isMaximized ? "md" : "sm"}
                                                    withBorder
                                                    radius="md"
                                                    style={{
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        border: '1px solid var(--mantine-color-gray-3)',
                                                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
                                                    }}
                                                    className="hover:shadow-lg"
                                                >
                                                    <Stack gap="xs">
                                                        <Group justify="space-between" align="flex-start">
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <Text
                                                                    size={isMaximized ? "md" : "sm"}
                                                                    fw={600}
                                                                    mb="xs"
                                                                    style={{
                                                                        color: 'var(--mantine-color-finBlue-7)',
                                                                        lineHeight: 1.4,
                                                                        wordBreak: 'break-word'
                                                                    }}
                                                                >
                                                                    {product.name}
                                                                </Text>
                                                                <Group gap="xs" align="center" wrap="wrap">
                                                                    {product.provider && (
                                                                        <Badge
                                                                            size={isMaximized ? "sm" : "xs"}
                                                                            variant="gradient"
                                                                            gradient={{ from: 'finGreen.5', to: 'finGreen.7' }}
                                                                            style={{ fontWeight: 500 }}
                                                                        >
                                                                            🏦 {product.provider}
                                                                        </Badge>
                                                                    )}
                                                                    {product.type && (
                                                                        <Badge
                                                                            size={isMaximized ? "sm" : "xs"}
                                                                            variant="light"
                                                                            color="blue"
                                                                        >
                                                                            {product.type}
                                                                        </Badge>
                                                                    )}
                                                                    {product.rating && (
                                                                        <Badge
                                                                            size={isMaximized ? "sm" : "xs"}
                                                                            variant="light"
                                                                            color="yellow"
                                                                        >
                                                                            ⭐ {product.rating}/5
                                                                        </Badge>
                                                                    )}
                                                                </Group>
                                                                {product.interestRate && (
                                                                    <Group gap="xs" mt="xs" align="center">
                                                                        <Text
                                                                            size={isMaximized ? "sm" : "xs"}
                                                                            fw={500}
                                                                            c="finBlue"
                                                                        >
                                                                            💰 Interest Rate: {product.interestRate}%
                                                                        </Text>
                                                                    </Group>
                                                                )}
                                                            </div>
                                                            <Button
                                                                size={isMaximized ? "sm" : "xs"}
                                                                variant="gradient"
                                                                gradient={{ from: 'finBlue.6', to: 'finBlue.8' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (product.id) {
                                                                        window.open(`/product/${product.id}`, '_blank');
                                                                    }
                                                                }}
                                                                style={{
                                                                    minWidth: isMaximized ? '80px' : '60px',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {isMaximized ? '👁️ View Details' : '👁️ View'}
                                                            </Button>
                                                        </Group>
                                                    </Stack>
                                                </Card>
                                            ))}
                                        </div>
                                    </Stack>
                                )}

                                <Text size="xs" c="dimmed" mt={isMaximized ? "sm" : "xs"} style={{ fontSize: isMaximized ? '12px' : '10px' }}>
                                    🕐 {message.timestamp.toLocaleTimeString()}
                                </Text>
                            </div>
                        </Group>
                    ))}

                    {isLoading && (
                        <Group gap="sm" align="flex-start">
                            <Avatar color="finBlue" size="sm" mt={4}>
                                <IconRobot size={16} />
                            </Avatar>
                            <Paper p="sm" bg="gray.0">
                                <Group gap="sm">
                                    <Loader size="xs" />
                                    <Text size="sm" c="dimmed">
                                        Thinking...
                                    </Text>
                                </Group>
                            </Paper>
                        </Group>
                    )}
                </Stack>
            </ScrollArea>

            {/* Input Area */}
            <Divider />
            <Group gap="sm" p="md">
                <TextInput
                    flex={1}
                    placeholder="Ask me about financial products..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.currentTarget.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                />
                <ActionIcon
                    variant="gradient"
                    gradient={{ from: 'finBlue.6', to: 'finGreen.6', deg: 135 }}
                    size="lg"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                >
                    <IconSend size={16} />
                </ActionIcon>
            </Group>
        </Stack>
    );
};

export default ChatPanel;