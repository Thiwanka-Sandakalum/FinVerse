export interface Organization {
    id: string
    name: string
    type: 'Corporation' | 'SME' | 'Startup' | 'Financial Institution'
    status: 'Active' | 'Inactive' | 'Suspended'
    usersCount: number
    productsCount: number
    email: string
    phone: string
    address: string
    logo?: string
    createdAt: string
    updatedAt: string
    settings: {
        allowMultipleProducts: boolean
        requireApproval: boolean
        enableNotifications: boolean
    }
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: 'Admin' | 'Manager' | 'User' | 'Viewer'
    organizationId?: string
    organizationName?: string
    status: 'Active' | 'Inactive' | 'Pending'
    avatar?: string
    phone?: string
    createdAt: string
    lastLogin?: string
    permissions: string[]
}

export interface Product {
    id: string
    name: string
    type: 'Loan' | 'Lease' | 'Card' | 'Account' | 'Insurance'
    category: string
    organizationId: string
    organizationName: string
    interestRate: number
    status: 'Active' | 'Inactive' | 'Draft'
    minAmount: number
    maxAmount: number
    term: number
    termUnit: 'days' | 'months' | 'years'
    description: string
    features: string[]
    eligibilityCriteria: string[]
    createdAt: string
    updatedAt: string
    analytics: {
        applicationsCount: number
        approvalRate: number
        averageAmount: number
        revenue: number
    }
}

export interface ChartData {
    name: string
    value: number
    date?: string
    category?: string
}

export interface KPI {
    title: string
    value: string | number
    change: number
    changeType: 'increase' | 'decrease'
    icon: string
    color: string
}

export interface LogItem {
    id: string
    action: string
    user: string
    timestamp: string
    details: string
    type: 'info' | 'warning' | 'error' | 'success'
}

export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
    width?: string | number
    render?: (value: any, item: any) => React.ReactNode
}

export interface FilterOption {
    label: string
    value: string
}

export interface DashboardStats {
    totalOrganizations: number
    totalUsers: number
    activeProducts: number
    totalRevenue: number
    organizationsGrowth: number
    usersGrowth: number
    productsGrowth: number
    revenueGrowth: number
}