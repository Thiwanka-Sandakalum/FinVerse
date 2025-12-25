import type { User } from '../types'

export const dummyUsers: User[] = [
    {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techcorp.com',
        role: 'Admin',
        organizationId: 'org-1',
        organizationName: 'TechCorp Financial',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=JD',
        phone: '+1-555-1001',
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: '2024-11-20T09:15:00Z',
        permissions: ['manage_users', 'manage_products', 'view_analytics', 'manage_settings']
    },
    {
        id: 'user-2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        role: 'Manager',
        organizationId: 'org-1',
        organizationName: 'TechCorp Financial',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=SJ',
        phone: '+1-555-1002',
        createdAt: '2023-02-20T14:20:00Z',
        lastLogin: '2024-11-19T16:45:00Z',
        permissions: ['manage_products', 'view_analytics']
    },
    {
        id: 'user-3',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@startuplend.com',
        role: 'Admin',
        organizationId: 'org-2',
        organizationName: 'StartupLend Inc',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=MC',
        phone: '+1-555-2001',
        createdAt: '2023-06-20T09:45:00Z',
        lastLogin: '2024-11-20T07:30:00Z',
        permissions: ['manage_users', 'manage_products', 'view_analytics', 'manage_settings']
    },
    {
        id: 'user-4',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@globalbank.com',
        role: 'Manager',
        organizationId: 'org-3',
        organizationName: 'Global Bank Solutions',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=ER',
        phone: '+1-555-3001',
        createdAt: '2022-12-10T11:15:00Z',
        lastLogin: '2024-11-19T18:20:00Z',
        permissions: ['manage_products', 'view_analytics']
    },
    {
        id: 'user-5',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@smefinance.com',
        role: 'User',
        organizationId: 'org-4',
        organizationName: 'SME Finance Hub',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=DW',
        phone: '+1-555-4001',
        createdAt: '2023-03-25T16:00:00Z',
        lastLogin: '2024-11-18T14:10:00Z',
        permissions: ['view_analytics']
    },
    {
        id: 'user-6',
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@digitalcu.com',
        role: 'Admin',
        organizationId: 'org-6',
        organizationName: 'Digital Credit Union',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=LT',
        phone: '+1-555-6001',
        createdAt: '2023-03-05T13:30:00Z',
        lastLogin: '2024-11-20T08:45:00Z',
        permissions: ['manage_users', 'manage_products', 'view_analytics', 'manage_settings']
    },
    {
        id: 'user-7',
        firstName: 'James',
        lastName: 'Brown',
        email: 'james.brown@entlending.com',
        role: 'Manager',
        organizationId: 'org-8',
        organizationName: 'Enterprise Lending Corp',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=JB',
        phone: '+1-555-8001',
        createdAt: '2022-10-15T10:45:00Z',
        lastLogin: '2024-11-19T12:30:00Z',
        permissions: ['manage_products', 'view_analytics']
    },
    {
        id: 'user-8',
        firstName: 'Anna',
        lastName: 'Garcia',
        email: 'anna.garcia@techcorp.com',
        role: 'User',
        organizationId: 'org-1',
        organizationName: 'TechCorp Financial',
        status: 'Pending',
        avatar: 'https://via.placeholder.com/50x50?text=AG',
        phone: '+1-555-1003',
        createdAt: '2024-11-10T09:20:00Z',
        lastLogin: undefined,
        permissions: ['view_analytics']
    },
    {
        id: 'user-9',
        firstName: 'Robert',
        lastName: 'Lee',
        email: 'robert.lee@quicklease.com',
        role: 'Viewer',
        organizationId: 'org-5',
        organizationName: 'QuickLease Partners',
        status: 'Inactive',
        avatar: 'https://via.placeholder.com/50x50?text=RL',
        phone: '+1-555-5001',
        createdAt: '2023-08-15T15:10:00Z',
        lastLogin: '2024-10-25T11:20:00Z',
        permissions: ['view_analytics']
    },
    {
        id: 'user-10',
        firstName: 'Jessica',
        lastName: 'Martinez',
        email: 'jessica.martinez@globalbank.com',
        role: 'Manager',
        organizationId: 'org-3',
        organizationName: 'Global Bank Solutions',
        status: 'Active',
        avatar: 'https://via.placeholder.com/50x50?text=JM',
        phone: '+1-555-3002',
        createdAt: '2023-01-20T12:00:00Z',
        lastLogin: '2024-11-20T10:15:00Z',
        permissions: ['manage_products', 'view_analytics']
    }
]

export const getUserById = (id: string): User | undefined => {
    return dummyUsers.find(user => user.id === id)
}

export const getUsersByOrganization = (organizationId: string): User[] => {
    return dummyUsers.filter(user => user.organizationId === organizationId)
}

export const getUsersByRole = (role: User['role']): User[] => {
    return dummyUsers.filter(user => user.role === role)
}

export const getUsersByStatus = (status: User['status']): User[] => {
    return dummyUsers.filter(user => user.status === status)
}