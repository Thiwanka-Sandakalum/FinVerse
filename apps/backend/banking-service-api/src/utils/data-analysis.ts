export const inferDataType = (value: any): string => {
    if (value === null || value === undefined) {
        return 'null';
    }

    if (typeof value === 'string') {
        if (!isNaN(Date.parse(value))) return 'date';
        if (!isNaN(Number(value))) return 'number';
        return 'string';
    }

    if (typeof value === 'number') {
        return Number.isInteger(value) ? 'integer' : 'decimal';
    }

    if (typeof value === 'boolean') return 'boolean';

    if (Array.isArray(value)) {
        if (value.length === 0) return 'array';
        const firstType = inferDataType(value[0]);
        return value.every(item => inferDataType(item) === firstType)
            ? `array<${firstType}>`
            : 'array<mixed>';
    }

    if (typeof value === 'object') return 'object';

    return 'unknown';
};

const fieldDescriptions: Record<string, string> = {
    interestRate: 'Interest rate percentage',
    minimumAmount: 'Minimum amount required',
    maximumAmount: 'Maximum amount allowed',
    tenure: 'Tenure period',
    tenureUnit: 'Unit for tenure (days, months, years)',
    currency: 'Currency code (e.g., LKR, USD)',
    features: 'List of product features',
    penaltyRate: 'Penalty rate percentage',
    fees: 'Associated fees',
    requirements: 'Product requirements',
    benefits: 'Product benefits',
    eligibility: 'Eligibility criteria',
    terms: 'Terms and conditions',
    maturityAmount: 'Amount at maturity',
    monthlyPayment: 'Monthly payment amount',
    annualFee: 'Annual fee amount',
    processingFee: 'Processing fee amount'
};

export const generateFieldDescription = (key: string): string => {
    return fieldDescriptions[key] || `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`;
};

export interface FieldInfo {
    key: string;
    type: string;
    examples: Set<any>;
    isRequired: boolean;
    description?: string;
}

export const analyzeProductFields = (products: { details: any }[]) => {
    const fieldMap = new Map<string, FieldInfo>();

    for (const product of products) {
        if (product.details && typeof product.details === 'object') {
            const details = product.details as Record<string, any>;

            Object.entries(details).forEach(([key, value]) => {
                if (!fieldMap.has(key)) {
                    fieldMap.set(key, {
                        key,
                        type: inferDataType(value),
                        examples: new Set(),
                        isRequired: false,
                        description: generateFieldDescription(key)
                    });
                }

                const field = fieldMap.get(key)!;

                if (field.examples.size < 5) {
                    field.examples.add(value);
                }

                const currentType = inferDataType(value);
                if (field.type !== currentType && field.type !== 'mixed') {
                    field.type = 'mixed';
                }
            });
        }
    }

    const totalProducts = products.length;
    const fields = Array.from(fieldMap.values()).map(field => ({
        key: field.key,
        type: field.type,
        examples: Array.from(field.examples).slice(0, 3),
        isRequired: false,
        description: field.description,
        frequency: {
            count: field.examples.size,
            percentage: totalProducts > 0 ? Math.round((field.examples.size / totalProducts) * 100) : 0
        }
    }));

    fields.sort((a, b) => b.frequency.percentage - a.frequency.percentage);
    return fields;
};