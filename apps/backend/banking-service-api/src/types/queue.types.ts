import { Channel, Connection } from 'amqplib';
import { InteractionEvent } from './interaction.types';

export interface QueueConfig {
    uri: string;
    exchangeName: string;
    queues: {
        interactions: string;
    };
    reconnectDelay: number;
}

export interface QueueConnection {
    connection: Connection | null;
    channel: Channel | null;
    isConnected: boolean;
}

export interface QueueMessage {
    exchangeName: string;
    routingKey: string;
    message: Buffer;
    options: {
        persistent: boolean;
        timestamp: number;
        contentType: string;
    };
}