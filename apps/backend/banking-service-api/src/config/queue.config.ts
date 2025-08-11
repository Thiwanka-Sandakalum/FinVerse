export interface QueueConfig {
    uri: string;
    exchangeName: string;
    exchangeType: string;
    queues: {
        productViews: string;
        interactions: string;
        comparisons: string;
        searches: string;
    };
    reconnectAttempts: number;
    reconnectDelay: number;
}

export const queueConfig: QueueConfig = {
    uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672/',
    exchangeName: process.env.RABBITMQ_EXCHANGE || 'interaction_events',
    exchangeType: 'topic',
    queues: {
        productViews: process.env.RABBITMQ_PRODUCT_VIEW_QUEUE || 'product_views',
        interactions: process.env.RABBITMQ_INTERACTION_QUEUE || 'interactions',
        comparisons: process.env.RABBITMQ_COMPARISON_QUEUE || 'comparisons',
        searches: process.env.RABBITMQ_SEARCH_QUEUE || 'searches'
    },
    reconnectAttempts: parseInt(process.env.RABBITMQ_RECONNECT_ATTEMPTS || '5'),
    reconnectDelay: parseInt(process.env.RABBITMQ_RECONNECT_DELAY || '5000')
};
