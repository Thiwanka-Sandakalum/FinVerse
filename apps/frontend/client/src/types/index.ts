/**
 * Main types index file for FinVerse client application
 * Re-exports types from different modules and defines app-specific interfaces
 */

// Re-export from generated API types
// Product type for ProductCard (extends LocalProduct, ensures all fields needed by ProductCard)
export type Product = {
    id: string;
    name: string;
    provider: string;
    type: string;
    logo?: string;
    description: string;
    interestRate?: number;
    annualFee?: number;
    rewards?: string;
    cashback?: string;
    eligibility?: string[];
    features: string[];
    rating: number;
    tags: string[];
    fees?: {
        annual?: number;
        foreign?: number;
        transaction?: number;
    };
    terms?: {
        gracePeriod?: number;
    };
    minAmount?: number;
};
export type { User } from './user';

// Import for local use in this file
import type { User } from './user';

// Local Product interface (different from API-generated one)
export interface LocalProduct {
    id: string;
    name: string;
    provider: string;
    type: string;
    logo?: string;
    description: string;
    interestRate?: number;
    annualFee?: number;
    rewards?: string;
    cashback?: string;
    eligibility?: string[];
    features: string[];
    rating: number;
    tags: string[];
    fees?: {
        annual?: number;
        foreign?: number;
        transaction?: number;
    };
    terms?: {
        gracePeriod?: number;
    };
    minAmount?: number;
}

// Local User interface extending the API User
export interface LocalUser extends User {
    savedProducts: string[];
    income?: number;
    creditScore?: number;
    preferences?: {
        language: string;
        currency: string;
    };
}

// App-specific interfaces and types
export interface AppState {
    user: LocalUser | null;
    products: LocalProduct[];
    filters: Filter;
    comparison: {
        selectedProducts: LocalProduct[];
        maxProducts: number;
        aiSummary?: string;
    };
    chat: {
        messages: ChatMessage[];
        isOpen: boolean;
    };
    loading: boolean;
    error: string | null;
}

export interface Filter {
    productTypes: string[];
    providers: string[];
    interestRateRange: [number, number];
    annualFeeRange: [number, number];
    minRating: number;
    features: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

// Chat message type for ChatPanel
export type ChatMessage = {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    productReferences?: Product[];
};

// API related types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface ProductSearchParams {
    query?: string;
    type?: string;
    provider?: string;
    minRating?: number;
    maxAnnualFee?: number;
    features?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}