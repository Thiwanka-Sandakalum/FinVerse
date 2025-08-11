import { Request } from 'express';
import { queueService } from './queue.service';
import { ProductViewEvent, SearchEvent, BaseInteractionEvent } from '../types/interaction.types';

class InteractionTrackingService {

    private extractBaseData(req: Request): BaseInteractionEvent {
        return {
            userId: (req as any).user?.userId ?? 'anonymous',
            sessionId: req.headers['x-session-id'] as string ?? undefined,
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip ?? req.connection.remoteAddress ?? '',
            timestamp: new Date(), // Use current time for timestamp
            source: 'banking-service',
            referrer: req.get('Referrer')
        };
    }

    async trackProductView(req: Request, productData: any): Promise<void> {
        try {
            console.log(`🎯 TRACKING PRODUCT VIEW: Product ID ${productData.id}, Name: ${productData.name}`);

            const baseData = this.extractBaseData(req);
            const viewEvent: ProductViewEvent = {
                ...baseData,
                action: 'product_view',
                productId: productData.id,
                productData: {
                    name: productData.name || 'Unknown Product',
                    categoryId: productData.categoryId || '',
                    categoryName: productData.category?.name,
                    productTypeId: productData.productTypeId || '',
                    productTypeName: productData.productType?.name,
                    institutionId: productData.institutionId || '',
                    institutionName: productData.institution?.name,
                    interestRate: productData.interestRate,
                    isActive: productData.isActive || false,
                    isFeatured: productData.isFeatured || false
                }
            };

            console.log(`📋 View Event:`, {
                productId: viewEvent.productId,
                productName: viewEvent.productData.name,
                userId: viewEvent.userId,
                timestamp: viewEvent.timestamp
            });

            console.log(`📤 SENDING MESSAGE TO QUEUE: ProductViewEvent`);
            const success = await queueService.publishInteractionEvent(viewEvent);

            if (success) {
                console.log(`✅ PRODUCT VIEW MESSAGE SENT SUCCESSFULLY!`);
            } else {
                console.log(`❌ FAILED TO SEND PRODUCT VIEW MESSAGE`);
            }

        } catch (error) {
            console.error(`❌ ERROR TRACKING PRODUCT VIEW:`, error);
            // Don't throw - we don't want tracking failures to break the main functionality
        }
    }

    async trackSearch(req: Request, query: string, resultCount: number, filters?: any): Promise<void> {
        try {
            console.log(`🔍 TRACKING SEARCH: Query "${query}", Results: ${resultCount}`);

            const baseData = this.extractBaseData(req);
            const searchEvent: SearchEvent = {
                ...baseData,
                action: 'search',
                query,
                filters: filters || {},
                resultCount
            };

            console.log(`📋 Search Event:`, {
                query: searchEvent.query,
                resultCount: searchEvent.resultCount,
                userId: searchEvent.userId,
                timestamp: searchEvent.timestamp
            });

            console.log(`📤 SENDING MESSAGE TO QUEUE: SearchEvent`);
            const success = await queueService.publishInteractionEvent(searchEvent);

            if (success) {
                console.log(`✅ SEARCH MESSAGE SENT SUCCESSFULLY!`);
            } else {
                console.log(`❌ FAILED TO SEND SEARCH MESSAGE`);
            }

        } catch (error) {
            console.error(`❌ ERROR TRACKING SEARCH:`, error);
            // Don't throw - we don't want tracking failures to break the main functionality
        }
    }

    async trackComparison(req: Request, productIds: string[]): Promise<void> {
        try {
            console.log(`🔄 TRACKING COMPARISON: Products ${productIds.join(', ')}`);

            const baseData = this.extractBaseData(req);
            const comparisonEvent = {
                ...baseData,
                action: 'comparison' as const,
                productIds
            };

            console.log(`📋 Comparison Event:`, {
                productIds: comparisonEvent.productIds,
                userId: comparisonEvent.userId,
                timestamp: comparisonEvent.timestamp
            });

            console.log(`📤 SENDING MESSAGE TO QUEUE: ComparisonEvent`);
            const success = await queueService.publishInteractionEvent(comparisonEvent);

            if (success) {
                console.log(`✅ COMPARISON MESSAGE SENT SUCCESSFULLY!`);
            } else {
                console.log(`❌ FAILED TO SEND COMPARISON MESSAGE`);
            }

        } catch (error) {
            console.error(`❌ ERROR TRACKING COMPARISON:`, error);
        }
    }
}

export const interactionTracker = new InteractionTrackingService();