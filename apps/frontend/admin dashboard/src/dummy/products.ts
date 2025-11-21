import type { Product } from '../types'

export const dummyProducts: Product[] = [
    {
        id: 'prod-1',
        name: 'Business Growth Loan',
        type: 'Loan',
        category: 'Business Loan',
        organizationId: 'org-1',
        organizationName: 'TechCorp Financial',
        interestRate: 8.5,
        status: 'Active',
        minAmount: 10000,
        maxAmount: 500000,
        term: 24,
        termUnit: 'months',
        description: 'Flexible business loan for growth and expansion with competitive rates.',
        features: ['Flexible repayment terms', 'No prepayment penalty', 'Quick approval'],
        eligibilityCriteria: ['Minimum 2 years in business', 'Annual revenue $100K+', 'Good credit score'],
        createdAt: '2023-02-01T10:00:00Z',
        updatedAt: '2024-11-15T14:30:00Z',
        analytics: {
            applicationsCount: 145,
            approvalRate: 78,
            averageAmount: 125000,
            revenue: 1250000
        }
    },
    {
        id: 'prod-2',
        name: 'Premium Business Card',
        type: 'Card',
        category: 'Credit Card',
        organizationId: 'org-1',
        organizationName: 'TechCorp Financial',
        interestRate: 16.9,
        status: 'Active',
        minAmount: 1000,
        maxAmount: 50000,
        term: 12,
        termUnit: 'months',
        description: 'Premium business credit card with rewards and benefits.',
        features: ['2% cashback on all purchases', '0% introductory APR', 'Travel insurance'],
        eligibilityCriteria: ['Business registration required', 'Minimum credit score 650', 'Annual revenue $50K+'],
        createdAt: '2023-03-15T11:20:00Z',
        updatedAt: '2024-11-10T09:15:00Z',
        analytics: {
            applicationsCount: 89,
            approvalRate: 85,
            averageAmount: 15000,
            revenue: 234500
        }
    },
    {
        id: 'prod-3',
        name: 'Equipment Lease Program',
        type: 'Lease',
        category: 'Equipment Financing',
        organizationId: 'org-2',
        organizationName: 'StartupLend Inc',
        interestRate: 12.0,
        status: 'Active',
        minAmount: 5000,
        maxAmount: 200000,
        term: 36,
        termUnit: 'months',
        description: 'Lease program for business equipment and machinery.',
        features: ['Tax advantages', 'Flexible terms', 'End-of-lease options'],
        eligibilityCriteria: ['Business entity required', 'Equipment specifications needed', 'Financial statements'],
        createdAt: '2023-06-25T14:45:00Z',
        updatedAt: '2024-11-12T16:20:00Z',
        analytics: {
            applicationsCount: 67,
            approvalRate: 72,
            averageAmount: 85000,
            revenue: 567000
        }
    },
    {
        id: 'prod-4',
        name: 'Corporate Savings Account',
        type: 'Account',
        category: 'Business Account',
        organizationId: 'org-3',
        organizationName: 'Global Bank Solutions',
        interestRate: 3.5,
        status: 'Active',
        minAmount: 1000,
        maxAmount: 1000000,
        term: 12,
        termUnit: 'months',
        description: 'High-yield corporate savings account with competitive interest rates.',
        features: ['No monthly fees', 'Online banking', 'Mobile app access', 'ATM network'],
        eligibilityCriteria: ['Business registration', 'Minimum deposit $1,000', 'Valid business documentation'],
        createdAt: '2022-11-20T09:30:00Z',
        updatedAt: '2024-11-18T11:45:00Z',
        analytics: {
            applicationsCount: 234,
            approvalRate: 95,
            averageAmount: 45000,
            revenue: 890000
        }
    },
    {
        id: 'prod-5',
        name: 'Small Business Insurance',
        type: 'Insurance',
        category: 'Business Insurance',
        organizationId: 'org-3',
        organizationName: 'Global Bank Solutions',
        interestRate: 0,
        status: 'Active',
        minAmount: 500,
        maxAmount: 50000,
        term: 12,
        termUnit: 'months',
        description: 'Comprehensive business insurance coverage for small to medium enterprises.',
        features: ['General liability', 'Property coverage', 'Workers compensation', '24/7 claims support'],
        eligibilityCriteria: ['Active business license', 'Business assessment required', 'No prior major claims'],
        createdAt: '2023-01-10T13:15:00Z',
        updatedAt: '2024-11-16T15:30:00Z',
        analytics: {
            applicationsCount: 156,
            approvalRate: 88,
            averageAmount: 12000,
            revenue: 456000
        }
    },
    {
        id: 'prod-6',
        name: 'Working Capital Loan',
        type: 'Loan',
        category: 'Short-term Loan',
        organizationId: 'org-4',
        organizationName: 'SME Finance Hub',
        interestRate: 11.5,
        status: 'Active',
        minAmount: 5000,
        maxAmount: 100000,
        term: 12,
        termUnit: 'months',
        description: 'Short-term working capital loan for immediate business needs.',
        features: ['Fast approval', 'Flexible repayment', 'No collateral required'],
        eligibilityCriteria: ['6 months in business', 'Regular revenue stream', 'Bank statements required'],
        createdAt: '2023-04-05T10:45:00Z',
        updatedAt: '2024-11-14T12:20:00Z',
        analytics: {
            applicationsCount: 98,
            approvalRate: 82,
            averageAmount: 35000,
            revenue: 320000
        }
    },
    {
        id: 'prod-7',
        name: 'Vehicle Lease',
        type: 'Lease',
        category: 'Vehicle Financing',
        organizationId: 'org-5',
        organizationName: 'QuickLease Partners',
        interestRate: 9.8,
        status: 'Inactive',
        minAmount: 15000,
        maxAmount: 80000,
        term: 48,
        termUnit: 'months',
        description: 'Commercial vehicle lease program for business fleets.',
        features: ['Maintenance included', 'Upgrade options', 'Mileage flexibility'],
        eligibilityCriteria: ['Valid business license', 'Driver requirements', 'Insurance coverage'],
        createdAt: '2023-08-10T11:30:00Z',
        updatedAt: '2024-10-30T14:15:00Z',
        analytics: {
            applicationsCount: 45,
            approvalRate: 76,
            averageAmount: 42000,
            revenue: 189000
        }
    },
    {
        id: 'prod-8',
        name: 'Digital Banking Account',
        type: 'Account',
        category: 'Digital Banking',
        organizationId: 'org-6',
        organizationName: 'Digital Credit Union',
        interestRate: 2.8,
        status: 'Active',
        minAmount: 100,
        maxAmount: 500000,
        term: 12,
        termUnit: 'months',
        description: 'Fully digital business banking account with modern features.',
        features: ['API integration', 'Real-time transactions', 'Advanced analytics', 'Mobile first'],
        eligibilityCriteria: ['Digital business verification', 'API compliance', 'KYC completion'],
        createdAt: '2023-03-01T08:20:00Z',
        updatedAt: '2024-11-19T10:45:00Z',
        analytics: {
            applicationsCount: 178,
            approvalRate: 92,
            averageAmount: 28000,
            revenue: 445000
        }
    },
    {
        id: 'prod-9',
        name: 'Enterprise Credit Line',
        type: 'Loan',
        category: 'Credit Line',
        organizationId: 'org-8',
        organizationName: 'Enterprise Lending Corp',
        interestRate: 7.2,
        status: 'Active',
        minAmount: 50000,
        maxAmount: 2000000,
        term: 60,
        termUnit: 'months',
        description: 'Revolving credit line for large enterprises with seasonal cash flow needs.',
        features: ['Revolving credit', 'Interest-only periods', 'Prime rate pricing', 'Dedicated relationship manager'],
        eligibilityCriteria: ['Established enterprise', 'Audited financials', 'Minimum revenue $1M', 'Credit rating required'],
        createdAt: '2022-10-20T15:00:00Z',
        updatedAt: '2024-11-17T13:25:00Z',
        analytics: {
            applicationsCount: 67,
            approvalRate: 85,
            averageAmount: 450000,
            revenue: 2150000
        }
    },
    {
        id: 'prod-10',
        name: 'Startup Innovation Card',
        type: 'Card',
        category: 'Startup Card',
        organizationId: 'org-7',
        organizationName: 'InnovateFintech',
        interestRate: 18.9,
        status: 'Draft',
        minAmount: 500,
        maxAmount: 25000,
        term: 12,
        termUnit: 'months',
        description: 'Specialized credit card for startups and innovative businesses.',
        features: ['Startup rewards', 'Expense categorization', 'Integration tools', 'Investor reporting'],
        eligibilityCriteria: ['Registered startup', 'Funding documentation', 'Business plan required'],
        createdAt: '2024-01-15T12:30:00Z',
        updatedAt: '2024-09-20T16:45:00Z',
        analytics: {
            applicationsCount: 12,
            approvalRate: 67,
            averageAmount: 8500,
            revenue: 15000
        }
    }
]

export const getProductById = (id: string): Product | undefined => {
    return dummyProducts.find(product => product.id === id)
}

export const getProductsByOrganization = (organizationId: string): Product[] => {
    return dummyProducts.filter(product => product.organizationId === organizationId)
}

export const getProductsByType = (type: Product['type']): Product[] => {
    return dummyProducts.filter(product => product.type === type)
}

export const getProductsByStatus = (status: Product['status']): Product[] => {
    return dummyProducts.filter(product => product.status === status)
}