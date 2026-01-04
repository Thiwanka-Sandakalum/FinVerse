export interface MarketplacePageProps {
    onProductSelect?: (productId: string) => void;
}

export interface Filters {
    institution: string;
    rateRange: string;
    feature: string;
}
