import { Request } from 'express';
import { publishInteractionEvent } from './queue.service';
import { ProductViewEvent, SearchEvent, BaseInteractionEvent } from '../types/interaction.types';
import { logger } from '../config/logger';

const extractBaseData = (req: Request): BaseInteractionEvent => ({
    userId: (req as any).user?.userId ?? 'anonymous',
    sessionId: req.headers['x-session-id'] as string ?? undefined,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip ?? req.connection.remoteAddress ?? '',
    timestamp: new Date(),
    source: 'banking-service',
    referrer: req.get('Referrer')
});

export const trackProductView = async (req: Request, productData: any): Promise<void> => {
    try {
        logger.info('TRACKING PRODUCT VIEW', {
            productId: productData.id,
            productName: productData.name
        });

        const viewEvent: ProductViewEvent = {
            ...extractBaseData(req),
            action: 'product_view',
            productId: productData.id,
            productData: {
                name: productData.name || 'Unknown Product',
                categoryId: productData.categoryId || '',
                categoryName: productData.category?.name,
                institutionId: productData.institutionId || '',
                institutionName: productData.institution?.name,
                interestRate: productData.interestRate,
                isActive: productData.isActive || false,
                isFeatured: productData.isFeatured || false
            }
        };

        logger.info('View Event', {
            productId: viewEvent.productId,
            productName: viewEvent.productData.name,
            userId: viewEvent.userId,
            timestamp: viewEvent.timestamp
        });

        const success = await publishInteractionEvent(viewEvent);
        logger.info(success ? 'PRODUCT VIEW MESSAGE SENT' : 'FAILED TO SEND PRODUCT VIEW MESSAGE');

    } catch (error) {
        logger.error('ERROR TRACKING PRODUCT VIEW:', error);
    }
};

export const trackSearch = async (req: Request, query: string, resultCount: number, filters?: any): Promise<void> => {
    try {
        logger.info('TRACKING SEARCH', {
            query,
            resultCount
        });

        const searchEvent: SearchEvent = {
            ...extractBaseData(req),
            action: 'search',
            query,
            filters: filters || {},
            resultCount
        };

        logger.info('Search Event', {
            query: searchEvent.query,
            resultCount: searchEvent.resultCount,
            userId: searchEvent.userId,
            timestamp: searchEvent.timestamp
        });

        const success = await publishInteractionEvent(searchEvent);
        logger.info(success ? 'SEARCH MESSAGE SENT' : 'FAILED TO SEND SEARCH MESSAGE');

    } catch (error) {
        logger.error('ERROR TRACKING SEARCH:', error);
    }
};

export const trackComparison = async (req: Request, productIds: string[]): Promise<void> => {
    try {
        logger.info('TRACKING COMPARISON', {
            productIds: productIds.join(', ')
        });

        const comparisonEvent = {
            ...extractBaseData(req),
            action: 'comparison' as const,
            productIds
        };

        logger.info('Comparison Event', {
            productIds: comparisonEvent.productIds,
            userId: comparisonEvent.userId,
            timestamp: comparisonEvent.timestamp
        });

        const success = await publishInteractionEvent(comparisonEvent);
        logger.info(success ? 'COMPARISON MESSAGE SENT' : 'FAILED TO SEND COMPARISON MESSAGE');

    } catch (error) {
        logger.error('ERROR TRACKING COMPARISON:', error);
    }
};