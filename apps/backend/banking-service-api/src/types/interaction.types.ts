export interface BaseInteractionEvent {
    userId?: string;
    sessionId?: string;
    timestamp: Date;
    source: string;
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
}

export interface ProductViewEvent extends BaseInteractionEvent {
    action: 'product_view';
    productId: string;
    productData: {
        name: string;
        categoryId: string;
        categoryName?: string;

        institutionId: string;
        institutionName?: string;
        interestRate?: number;
        isActive: boolean;
        isFeatured: boolean;
    };
    metadata?: {
        viewDuration?: number;
        scrollDepth?: number;
        clickedFeatures?: string[];
    };
}

export interface SearchEvent extends BaseInteractionEvent {
    action: 'search';
    query: string;
    filters?: {
        categoryId?: string;
        institutionId?: string;

        isFeatured?: boolean;
        isActive?: boolean;
    };
    resultCount: number;
    selectedProductId?: string;
}

export interface ComparisonEvent extends BaseInteractionEvent {
    action: 'comparison';
    productIds: string[];
    comparisonDuration?: number;
}

export type InteractionEvent = ProductViewEvent | SearchEvent | ComparisonEvent;
