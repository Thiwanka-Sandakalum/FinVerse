import { Request } from 'express';
import { sendAuditLogToWorker } from './audit-log.worker.manager';
import { BaseInteractionEvent } from '../types/interaction.types';
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

        const baseData = extractBaseData(req);
        await sendAuditLogToWorker({
            userId: baseData.userId,
            sessionId: baseData.sessionId,
            action: 'product_view',
            details: {
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
            },
            ipAddress: baseData.ipAddress,
            userAgent: baseData.userAgent,
            referrer: baseData.referrer
        });
        logger.info('PRODUCT VIEW AUDIT LOGGED');
    } catch (error) {
        logger.error('ERROR TRACKING PRODUCT VIEW:', error);
    }
};


export const trackSearch = async (req: Request, query: string, resultCount: number, filters?: any): Promise<void> => {
    try {
        const baseData = extractBaseData(req);
        await sendAuditLogToWorker({
            userId: baseData.userId,
            sessionId: baseData.sessionId,
            action: 'search',
            details: {
                query,
                filters: filters || {},
                resultCount
            },
            ipAddress: baseData.ipAddress,
            userAgent: baseData.userAgent,
            referrer: baseData.referrer
        });
    } catch (error) {
        logger.error('ERROR TRACKING SEARCH:', error);
    }
};


export const trackComparison = async (req: Request, productIds: string[]): Promise<void> => {
    try {
        logger.info('TRACKING COMPARISON', {
            productIds: productIds.join(', ')
        });

        const baseData = extractBaseData(req);
        await sendAuditLogToWorker({
            userId: baseData.userId,
            sessionId: baseData.sessionId,
            action: 'comparison',
            details: {
                productIds
            },
            ipAddress: baseData.ipAddress,
            userAgent: baseData.userAgent,
            referrer: baseData.referrer
        });
        logger.info('COMPARISON AUDIT LOGGED');
    } catch (error) {
        logger.error('ERROR TRACKING COMPARISON:', error);
    }
};