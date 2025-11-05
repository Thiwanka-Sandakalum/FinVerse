import { Channel, Connection, connect } from 'amqplib';
import { logger } from '../config/logger';
import { queueConfig } from '../config/queue.config';
import { InteractionEvent } from '../types/interaction.types';
import { QueueConnection, QueueMessage } from '../types/queue.types';

// Immutable state management
let queueConnection: QueueConnection = {
    connection: null,
    channel: null,
    isConnected: false
};

/**
 * Creates a new RabbitMQ connection
 */
const createConnection = async (): Promise<Connection> => {
    logger.info('Connecting to RabbitMQ...');
    const conn = await connect(queueConfig.uri);
    return conn as unknown as Connection;
};

/**
 * Creates a channel from a connection
 */
const createChannel = async (connection: Connection): Promise<Channel> => {
    return (await (connection as any).createChannel()) as Channel;
};

/**
 * Sets up exchange and queues
 */
const setupExchangeAndQueues = async (channel: Channel): Promise<void> => {
    await channel.assertExchange(queueConfig.exchangeName, queueConfig.exchangeType, { durable: true });

    const queues = Object.values(queueConfig.queues);
    await Promise.all(queues.map(async (queueName) => {
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, queueConfig.exchangeName, queueName);
    }));
};

/**
 * Sets up error handlers for connection and channel
 */
const setupErrorHandlers = (connection: Connection, channel: Channel): void => {
    connection.on('error', (err: Error) => {
        logger.error('RabbitMQ connection error:', err);
        queueConnection.isConnected = false;
    });

    connection.on('close', () => {
        logger.error('RabbitMQ connection closed');
        queueConnection.isConnected = false;
    });

    channel.on('error', (err: Error) => {
        logger.error('RabbitMQ channel error:', err);
    });

    channel.on('close', () => {
        logger.error('RabbitMQ channel closed');
        queueConnection.isConnected = false;
    });
};

/**
 * Determines routing key based on action type
 */
const getRoutingKey = (action: string): string => {
    const routingKeys: Record<string, string> = {
        product_view: queueConfig.queues.productViews,
        search: queueConfig.queues.searches,
        comparison: queueConfig.queues.comparisons,
        default: queueConfig.queues.interactions
    };

    return routingKeys[action as keyof typeof routingKeys] || routingKeys.default;
};

/**
 * Creates message payload for publishing
 */
const createMessagePayload = (event: InteractionEvent): QueueMessage => ({
    exchangeName: queueConfig.exchangeName,
    routingKey: getRoutingKey(event.action),
    message: Buffer.from(JSON.stringify(event)),
    options: {
        persistent: true,
        timestamp: Math.floor(Date.now() / 1000),
        contentType: 'application/json'
    }
});

/**
 * Logs message details for debugging
 */
const logMessageDetails = (event: InteractionEvent, routingKey: string): void => {
    logger.debug('Sending message to queue:', {
        action: event.action,
        routingKey,
        exchange: queueConfig.exchangeName,
        userId: event.userId || 'anonymous',
        productId: event.action === 'product_view' ? (event as any).productId : undefined,
        timestamp: event.timestamp
    });
};

/**
 * Publishes a message to RabbitMQ
 */
const publishMessage = async (payload: QueueMessage): Promise<boolean> => {
    const { channel } = queueConnection;
    if (!channel) return false;

    return channel.publish(
        payload.exchangeName,
        payload.routingKey,
        payload.message,
        payload.options
    );
};

/**
 * Initializes RabbitMQ connection and channel
 */
export const initializeQueue = async (): Promise<void> => {
    try {
        const connection = await createConnection();
        const channel = await createChannel(connection);

        await setupExchangeAndQueues(channel);
        setupErrorHandlers(connection, channel);

        queueConnection = {
            connection,
            channel,
            isConnected: true
        };

        logger.info('Successfully connected to RabbitMQ');
    } catch (error) {
        logger.error('Failed to connect to RabbitMQ:', error);
        queueConnection.isConnected = false;
    }
};

/**
 * Publishes an interaction event to the queue
 */
export const publishInteractionEvent = async (event: InteractionEvent): Promise<boolean> => {
    if (!queueConnection.isConnected) {
        logger.warn('RabbitMQ not connected. Skipping event publication.');
        return false;
    }

    try {
        const payload = createMessagePayload(event);
        logMessageDetails(event, payload.routingKey);

        const published = await publishMessage(payload);

        if (published) {
            logger.debug(`Published ${event.action} event for user ${event.userId || 'anonymous'}`);
            return true;
        } else {
            logger.warn('Failed to publish event - channel buffer full');
            return false;
        }
    } catch (error) {
        logger.error('Error publishing interaction event:', error);
        return false;
    }
};

/**
 * Closes the queue connection gracefully
 */
export const closeQueue = async (): Promise<void> => {
    const { connection, channel } = queueConnection;

    try {
        if (channel) await channel.close();
        if (connection) await (connection as any).close();

        queueConnection = {
            connection: null,
            channel: null,
            isConnected: false
        };

        logger.info('RabbitMQ connection closed gracefully');
    } catch (error) {
        logger.error('Error closing RabbitMQ connection:', error);
    }
};

/**
 * Checks if queue is connected
 */
export const isQueueConnected = (): boolean => queueConnection.isConnected;

// Initialize queue connection
initializeQueue().catch(err => {
    logger.error('Failed to initialize queue connection:', err);
});
