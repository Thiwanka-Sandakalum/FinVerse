import type { ChartData, KPI, LogItem, DashboardStats } from '../types'

export const dashboardStats: DashboardStats = {
    totalOrganizations: 8,
    totalUsers: 2341,
    activeProducts: 24,
    totalRevenue: 7526000,
    organizationsGrowth: 12.5,
    usersGrowth: 23.8,
    productsGrowth: 8.3,
    revenueGrowth: 15.7
}

export const kpiData: KPI[] = [
    {
        title: 'Total Organizations',
        value: dashboardStats.totalOrganizations,
        change: dashboardStats.organizationsGrowth,
        changeType: 'increase',
        icon: 'building',
        color: 'blue'
    },
    {
        title: 'Total Users',
        value: dashboardStats.totalUsers.toLocaleString(),
        change: dashboardStats.usersGrowth,
        changeType: 'increase',
        icon: 'users',
        color: 'green'
    },
    {
        title: 'Active Products',
        value: dashboardStats.activeProducts,
        change: dashboardStats.productsGrowth,
        changeType: 'increase',
        icon: 'package',
        color: 'orange'
    },
    {
        title: 'Total Revenue',
        value: `$${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`,
        change: dashboardStats.revenueGrowth,
        changeType: 'increase',
        icon: 'currency-dollar',
        color: 'violet'
    }
]

export const organizationGrowthData: ChartData[] = [
    { name: 'Jan', value: 2, date: '2024-01' },
    { name: 'Feb', value: 3, date: '2024-02' },
    { name: 'Mar', value: 4, date: '2024-03' },
    { name: 'Apr', value: 4, date: '2024-04' },
    { name: 'May', value: 5, date: '2024-05' },
    { name: 'Jun', value: 6, date: '2024-06' },
    { name: 'Jul', value: 6, date: '2024-07' },
    { name: 'Aug', value: 7, date: '2024-08' },
    { name: 'Sep', value: 7, date: '2024-09' },
    { name: 'Oct', value: 8, date: '2024-10' },
    { name: 'Nov', value: 8, date: '2024-11' },
    { name: 'Dec', value: 8, date: '2024-12' }
]

export const userActivityData: ChartData[] = [
    { name: 'Jan', value: 1850, date: '2024-01' },
    { name: 'Feb', value: 1920, date: '2024-02' },
    { name: 'Mar', value: 2050, date: '2024-03' },
    { name: 'Apr', value: 2180, date: '2024-04' },
    { name: 'May', value: 2220, date: '2024-05' },
    { name: 'Jun', value: 2280, date: '2024-06' },
    { name: 'Jul', value: 2310, date: '2024-07' },
    { name: 'Aug', value: 2285, date: '2024-08' },
    { name: 'Sep', value: 2320, date: '2024-09' },
    { name: 'Oct', value: 2340, date: '2024-10' },
    { name: 'Nov', value: 2341, date: '2024-11' }
]

export const productTypesData: ChartData[] = [
    { name: 'Loans', value: 45, category: 'Loan' },
    { name: 'Cards', value: 28, category: 'Card' },
    { name: 'Accounts', value: 18, category: 'Account' },
    { name: 'Leases', value: 12, category: 'Lease' },
    { name: 'Insurance', value: 8, category: 'Insurance' }
]

export const revenueData: ChartData[] = [
    { name: 'Jan', value: 580000, date: '2024-01' },
    { name: 'Feb', value: 620000, date: '2024-02' },
    { name: 'Mar', value: 680000, date: '2024-03' },
    { name: 'Apr', value: 720000, date: '2024-04' },
    { name: 'May', value: 765000, date: '2024-05' },
    { name: 'Jun', value: 810000, date: '2024-06' },
    { name: 'Jul', value: 845000, date: '2024-07' },
    { name: 'Aug', value: 780000, date: '2024-08' },
    { name: 'Sep', value: 890000, date: '2024-09' },
    { name: 'Oct', value: 920000, date: '2024-10' },
    { name: 'Nov', value: 965000, date: '2024-11' }
]

export const applicationStatusData: ChartData[] = [
    { name: 'Approved', value: 756, category: 'approved' },
    { name: 'Pending', value: 234, category: 'pending' },
    { name: 'Rejected', value: 145, category: 'rejected' },
    { name: 'Under Review', value: 89, category: 'review' }
]

export const organizationTypeData: ChartData[] = [
    { name: 'Corporation', value: 3, category: 'Corporation' },
    { name: 'Financial Institution', value: 2, category: 'Financial Institution' },
    { name: 'Startup', value: 2, category: 'Startup' },
    { name: 'SME', value: 1, category: 'SME' }
]

export const monthlyApplicationsData: ChartData[] = [
    { name: 'Jan', value: 89, date: '2024-01' },
    { name: 'Feb', value: 102, date: '2024-02' },
    { name: 'Mar', value: 125, date: '2024-03' },
    { name: 'Apr', value: 148, date: '2024-04' },
    { name: 'May', value: 156, date: '2024-05' },
    { name: 'Jun', value: 178, date: '2024-06' },
    { name: 'Jul', value: 165, date: '2024-07' },
    { name: 'Aug', value: 142, date: '2024-08' },
    { name: 'Sep', value: 187, date: '2024-09' },
    { name: 'Oct', value: 203, date: '2024-10' },
    { name: 'Nov', value: 219, date: '2024-11' }
]

export const recentActivityLogs: LogItem[] = [
    {
        id: 'log-1',
        action: 'New organization registered',
        user: 'System',
        timestamp: '2024-11-20T09:15:00Z',
        details: 'TechStart Solutions completed registration',
        type: 'success'
    },
    {
        id: 'log-2',
        action: 'Product approved',
        user: 'John Doe',
        timestamp: '2024-11-20T08:45:00Z',
        details: 'Business Growth Loan v2.1 approved for launch',
        type: 'success'
    },
    {
        id: 'log-3',
        action: 'User login failed',
        user: 'sarah.johnson@techcorp.com',
        timestamp: '2024-11-20T08:30:00Z',
        details: 'Multiple failed login attempts detected',
        type: 'warning'
    },
    {
        id: 'log-4',
        action: 'Organization suspended',
        user: 'Admin',
        timestamp: '2024-11-19T16:20:00Z',
        details: 'QuickLease Partners suspended due to compliance issues',
        type: 'error'
    },
    {
        id: 'log-5',
        action: 'Bulk user import',
        user: 'Mike Chen',
        timestamp: '2024-11-19T14:10:00Z',
        details: '45 users imported for StartupLend Inc',
        type: 'info'
    },
    {
        id: 'log-6',
        action: 'Product updated',
        user: 'Emily Rodriguez',
        timestamp: '2024-11-19T12:45:00Z',
        details: 'Corporate Savings Account interest rate updated to 3.5%',
        type: 'info'
    },
    {
        id: 'log-7',
        action: 'System backup completed',
        user: 'System',
        timestamp: '2024-11-19T03:00:00Z',
        details: 'Daily backup completed successfully',
        type: 'success'
    },
    {
        id: 'log-8',
        action: 'New user registered',
        user: 'System',
        timestamp: '2024-11-18T17:30:00Z',
        details: 'Anna Garcia joined TechCorp Financial',
        type: 'info'
    }
]