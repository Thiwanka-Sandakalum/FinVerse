import { Product as ApiProduct, ProductCategory } from '@/services/products';
import React from 'react';
import { getInstitutionName } from './utils';
import { useSavedProducts } from '../../context/SavedProductsContext';

// Extended Product type with category (API returns this)
type ProductWithCategory = ApiProduct & {
    category?: ProductCategory;
};

interface ProductCardProps {
    product: ProductWithCategory;
    isInCompare: boolean;
    isDisabled: boolean;
    onCompareToggle: (e: React.MouseEvent, product: ProductWithCategory) => void;
    onDetailClick: (id: string) => void;
    variant: 'featured' | 'grid';
}

const typeColorMap: Record<string, string> = {
    loan: 'bg-blue-50 text-blue-600',
    card: 'bg-purple-50 text-purple-600',
    investment: 'bg-orange-50 text-orange-600',
    savings: 'bg-green-50 text-green-600',
    default: 'bg-gray-50 text-gray-600'
};

// Fields to exclude from display
const EXCLUDED_FIELDS = ['img_url', 'backgroundImage', 'features', 'benefits', 'travelPerks', 'assetTypes'];

// Priority order for displaying fields
const FIELD_PRIORITY: Record<string, number> = {
    interestRate: 1,
    cashback: 2,
    loanAmount: 3,
    minimumBalance: 4,
    creditLimit: 5,
    tenure: 6,
    annualFee: 7,
    payout: 8,
    leaseValue: 9,
    processingFee: 10,
    eligibility: 11
};

// Helper to get useful details entries, sorted by priority
const getDetailsEntries = (details: Record<string, any>, count: number = 4) => {
    const entries = Object.entries(details || {})
        .filter(([key]) => !EXCLUDED_FIELDS.includes(key))
        .sort(([keyA], [keyB]) => {
            const priorityA = FIELD_PRIORITY[keyA] || 999;
            const priorityB = FIELD_PRIORITY[keyB] || 999;
            return priorityA - priorityB;
        });

    return entries.slice(0, count);
};

// Helper to format field labels nicely
const formatLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
        interestRate: 'Interest Rate',
        loanAmount: 'Loan Amount',
        minimumBalance: 'Min Balance',
        creditLimit: 'Credit Limit',
        annualFee: 'Annual Fee',
        processingFee: 'Processing Fee',
        cashback: 'Cashback',
        leaseValue: 'Lease Value',
        payout: 'Payout'
    };
    return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to safely format value for display
const formatValue = (value: any, key?: string): string => {
    if (value === null || value === undefined) return 'N/A';

    // Handle eligibility object specially
    if (key === 'eligibility' && typeof value === 'object') {
        if (value.age) return `Age: ${value.age}`;
        if (value.minIncome) return `Min Income: LKR ${value.minIncome.toLocaleString()}`;
        if (value.employment) return value.employment;
        return 'See details';
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    // Handle objects (flatten to first useful value)
    if (typeof value === 'object') {
        const firstValue = Object.values(value)[0];
        return formatValue(firstValue);
    }

    // Format currency values
    if (typeof value === 'number' && (key?.includes('Balance') || key?.includes('Fee') || key?.includes('Amount'))) {
        return `LKR ${value.toLocaleString()}`;
    }

    // Format numbers with commas
    if (typeof value === 'number') {
        return value.toLocaleString();
    }

    return String(value);
};

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
    product,
    isInCompare,
    isDisabled,
    onCompareToggle,
    onDetailClick,
    variant
}) => {
    const institutionName = getInstitutionName(product.institutionId);
    const detailsEntries = getDetailsEntries(product.details, 4);
    const categoryName = product.category?.name || 'Product';
    const typeColor = typeColorMap[categoryName.toLowerCase()] || typeColorMap.default;
    const { isSaved, add, remove } = useSavedProducts();

    if (variant === 'featured') {
        return (
            <div
                onClick={() => onDetailClick(product.id)}
                className="min-w-[300px] md:min-w-[340px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 snap-center flex flex-col relative group cursor-pointer"
            >
                {product.isFeatured && (
                    <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-xl z-10 shadow-sm">
                        Featured
                    </div>
                )}

                <div className="p-6 flex-1">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 rounded-full border border-gray-100 p-1 bg-white flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">{institutionName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                            <p className="text-sm text-gray-500">{institutionName}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-50">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                {detailsEntries[0]?.[0] ? formatLabel(detailsEntries[0][0]) : 'Details'}
                            </p>
                            <p className="text-3xl font-bold text-brand-600">
                                {formatValue(detailsEntries[0]?.[1], detailsEntries[0]?.[0])}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${typeColor}`}>
                                {categoryName}
                            </span>
                        </div>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                        {detailsEntries.slice(1, 4).map(([key, value], i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600">
                                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-semibold mr-1">{formatLabel(key)}:</span> {formatValue(value, key)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center gap-2">
                    <button
                        onClick={(e) => onCompareToggle(e, product)}
                        disabled={isDisabled}
                        className={`flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold border transition-all ${isInCompare
                            ? 'bg-accent-50 border-accent-200 text-accent-700'
                            : isDisabled
                                ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
                            }`}
                        title={isDisabled ? "Comparison limit reached (4 products)" : "Add to compare"}
                    >
                        <div className={`w-3.5 h-3.5 rounded border mr-1.5 flex items-center justify-center ${isInCompare ? 'bg-accent-500 border-accent-500' : 'border-gray-400'}`}>
                            {isInCompare && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        Compare
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isSaved(product.id)) {
                                remove(product.id);
                            } else {
                                add(product.id);
                            }
                        }}
                        className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border ${isSaved(product.id)
                            ? 'text-red-500 bg-red-50 border-red-100'
                            : 'border-transparent hover:border-red-100'
                            }`}
                        title={isSaved(product.id) ? 'Remove from saved' : 'Save product'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onDetailClick(product.id); }}
                        className="flex-1 py-2 bg-brand-900 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition-colors shadow-sm flex items-center justify-center"
                    >
                        View Details
                    </button>
                </div>
            </div>
        );
    }

    // Grid variant
    return (
        <div
            onClick={() => onDetailClick(product.id)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all duration-300 flex flex-col group h-full cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">{institutionName.substring(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded">
                    {categoryName}
                </span>
            </div>

            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{institutionName}</p>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">
                    {detailsEntries[0]?.[0] ? formatLabel(detailsEntries[0][0]) : 'Details'}
                </div>
                <div className="text-xl font-bold text-brand-800">
                    {formatValue(detailsEntries[0]?.[1], detailsEntries[0]?.[0])}
                </div>
            </div>

            <div className="flex-1 mb-4">
                <ul className="space-y-1">
                    {detailsEntries.slice(1, 4).map(([key, value], i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start">
                            <span className="mr-1.5 mt-0.5 text-accent-500">•</span>
                            <span className="font-semibold mr-1">{formatLabel(key)}:</span> {formatValue(value, key)}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                <button
                    onClick={(e) => onCompareToggle(e, product)}
                    disabled={isDisabled}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isInCompare
                        ? 'bg-accent-50 border-accent-200 text-accent-700'
                        : isDisabled
                            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
                        }`}
                    title={isDisabled ? "Comparison limit reached (4 products)" : "Add to compare"}
                >
                    <div className={`w-3.5 h-3.5 rounded border mr-1.5 flex items-center justify-center ${isInCompare ? 'bg-accent-500 border-accent-500' : 'border-gray-400'}`}>
                        {isInCompare && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    Compare
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isSaved(product.id)) {
                            remove(product.id);
                        } else {
                            add(product.id);
                        }
                    }}
                    className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border ${isSaved(product.id)
                        ? 'text-red-500 bg-red-50 border-red-100'
                        : 'border-transparent hover:border-red-100'
                        }`}
                    title={isSaved(product.id) ? 'Remove from saved' : 'Save product'}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onDetailClick(product.id); }}
                    className="flex-1 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-lg transition-colors"
                >
                    Details
                </button>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
