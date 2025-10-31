import * as amqp from 'amqplib';
import { Connection, Channel } from 'amqplib';
import { queueConfig } from '../config/queue.config';
import { InteractionEvent } from '../types/interaction.types';
import { logger } from '../config/logger';

export class QueueService {
    private connection: any = null;
    private channel: Channel | null = null;
    private isConnected = false;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.connect().catch(err => {
            logger.error('Failed to initialize queue connection:', err);
        });
    }

    /**
     * Connect to RabbitMQ
     */
    private async connect(): Promise<void> {
        try {
            logger.info('Connecting to RabbitMQ...');
            this.connection = await amqp.connect(queueConfig.uri, {});
            this.channel = await this.connection.createChannel();

            // Set up connection error handlers
            if (this.connection) {
                this.connection.on('error', (err: Error) => {
                    logger.error('RabbitMQ connection error:', err);
                    this.isConnected = false;
                    // this.scheduleReconnect();
                });

                this.connection.on('close', () => {
                    logger.warn('RabbitMQ connection closed');
                    this.isConnected = false;
                    // this.scheduleReconnect();
                });
            }

            // Set up channel error handlers
            if (this.channel) {
                this.channel.on('error', (err) => {
                    logger.error('RabbitMQ channel error:', err);
                    this.isConnected = false;
                    // this.scheduleReconnect();
                });

                this.channel.on('close', () => {
                    logger.warn('RabbitMQ channel closed');
                    this.isConnected = false;
                    // this.scheduleReconnect();
                });

                // Declare exchange
                await this.channel.assertExchange(
                    queueConfig.exchangeName,
                    queueConfig.exchangeType,
                    { durable: true }
                );

                // Declare queues and bind them to the exchange
                const queues = Object.values(queueConfig.queues);
                for (const queueName of queues) {
                    await this.channel.assertQueue(queueName, { durable: true });
                    await this.channel.bindQueue(
                        queueName,
                        queueConfig.exchangeName,
                        queueName
                    );
                }
            }

            this.isConnected = true;
            logger.info('Successfully connected to RabbitMQ');

        } catch (error) {
            logger.error('Failed to connect to RabbitMQ:', error);
            this.isConnected = false;
            // this.scheduleReconnect();
        }
    }

    /**
     * Schedule reconnection attempt
     */
    // private scheduleReconnect(): void {
    //     if (this.reconnectTimer) {
    //         clearTimeout(this.reconnectTimer);
    //     }

    //     this.reconnectTimer = setTimeout(() => {
    //         logger.info('Attempting to reconnect to RabbitMQ...');
    //         this.connect();
    //     }, queueConfig.reconnectDelay);
    // }

    /**
     * Publish an interaction event to the queue
     */
    async publishInteractionEvent(event: InteractionEvent): Promise<boolean> {
        if (!this.isConnected || !this.channel) {
            logger.warn('RabbitMQ not connected. Skipping event publication.');
            console.log('❌ QUEUE NOT CONNECTED - Cannot send event:', event.action);
            return false;
        }

        try {
            const routingKey = this.getRoutingKey(event.action);
            const message = Buffer.from(JSON.stringify(event));

            console.log('📤 SENDING MESSAGE TO QUEUE:', {
                action: event.action,
                routingKey,
                exchange: queueConfig.exchangeName,
                userId: event.userId || 'anonymous',
                productId: event.action === 'product_view' ? (event as any).productId : undefined,
                timestamp: event.timestamp
            });

            const published = this.channel.publish(
                queueConfig.exchangeName,
                routingKey,
                message,
                {
                    persistent: true,
                    timestamp: Math.floor(Date.now() / 1000), // Convert to seconds for Python compatibility
                    contentType: 'application/json'
                }
            );

            if (published) {
                logger.debug(`Published ${event.action} event for user ${event.userId || 'anonymous'}`);
                console.log('✅ MESSAGE SENT SUCCESSFULLY:', {
                    action: event.action,
                    routingKey,
                    messageSize: message.length
                });
                return true;
            } else {
                logger.warn('Failed to publish event - channel buffer full');
                console.log('⚠️ MESSAGE SEND FAILED - Channel buffer full');
                return false;
            }
        } catch (error) {
            logger.error('Error publishing interaction event:', error);
            console.log('❌ MESSAGE SEND ERROR:', error);
            return false;
        }
    }

    /**
     * Get routing key based on action type
     */
    private getRoutingKey(action: string): string {
        switch (action) {
            case 'product_view':
                return queueConfig.queues.productViews;
            case 'search':
                return queueConfig.queues.searches;
            case 'comparison':
                return queueConfig.queues.comparisons;
            default:
                return queueConfig.queues.interactions;
        }
    }

    /**
     * Close connection gracefully
     */
    async close(): Promise<void> {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            this.isConnected = false;
            logger.info('RabbitMQ connection closed gracefully');
        } catch (error) {
            logger.error('Error closing RabbitMQ connection:', error);
        }
    }

    /**
     * Check if service is connected
     */
    isQueueConnected(): boolean {
        return this.isConnected;
    }
}

// Singleton instance
export const queueService = new QueueService();
