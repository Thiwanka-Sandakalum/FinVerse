import type { Organization } from "../types"

export const dummyOrganizations: Organization[] = [
    {
        id: 'org-1',
        name: 'TechCorp Financial',
        type: 'Corporation',
        status: 'Active',
        usersCount: 245,
        productsCount: 8,
        email: 'contact@techcorp.com',
        phone: '+1-555-0123',
        address: '123 Business Ave, New York, NY 10001',
        logo: 'https://via.placeholder.com/100x100?text=TC',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-11-15T14:30:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: false,
            enableNotifications: true
        }
    },
    {
        id: 'org-2',
        name: 'StartupLend Inc',
        type: 'Startup',
        status: 'Active',
        usersCount: 67,
        productsCount: 3,
        email: 'hello@startuplend.com',
        phone: '+1-555-0456',
        address: '456 Innovation St, San Francisco, CA 94105',
        logo: 'https://via.placeholder.com/100x100?text=SL',
        createdAt: '2023-06-20T09:15:00Z',
        updatedAt: '2024-11-10T11:45:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: true,
            enableNotifications: true
        }
    },
    {
        id: 'org-3',
        name: 'Global Bank Solutions',
        type: 'Financial Institution',
        status: 'Active',
        usersCount: 1250,
        productsCount: 15,
        email: 'info@globalbank.com',
        phone: '+1-555-0789',
        address: '789 Financial Plaza, Chicago, IL 60601',
        logo: 'https://via.placeholder.com/100x100?text=GB',
        createdAt: '2022-11-08T16:20:00Z',
        updatedAt: '2024-11-18T09:12:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: true,
            enableNotifications: true
        }
    },
    {
        id: 'org-4',
        name: 'SME Finance Hub',
        type: 'SME',
        status: 'Active',
        usersCount: 89,
        productsCount: 5,
        email: 'support@smefinance.com',
        phone: '+1-555-0321',
        address: '321 Commerce Rd, Austin, TX 73301',
        logo: 'https://via.placeholder.com/100x100?text=SF',
        createdAt: '2023-03-12T13:45:00Z',
        updatedAt: '2024-11-12T16:20:00Z',
        settings: {
            allowMultipleProducts: false,
            requireApproval: true,
            enableNotifications: false
        }
    },
    {
        id: 'org-5',
        name: 'QuickLease Partners',
        type: 'Corporation',
        status: 'Suspended',
        usersCount: 34,
        productsCount: 2,
        email: 'admin@quicklease.com',
        phone: '+1-555-0654',
        address: '654 Lease Ave, Miami, FL 33101',
        logo: 'https://via.placeholder.com/100x100?text=QL',
        createdAt: '2023-08-05T11:30:00Z',
        updatedAt: '2024-10-30T14:15:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: false,
            enableNotifications: true
        }
    },
    {
        id: 'org-6',
        name: 'Digital Credit Union',
        type: 'Financial Institution',
        status: 'Active',
        usersCount: 456,
        productsCount: 9,
        email: 'hello@digitalcu.com',
        phone: '+1-555-0987',
        address: '987 Digital St, Seattle, WA 98101',
        logo: 'https://via.placeholder.com/100x100?text=DC',
        createdAt: '2023-02-28T08:20:00Z',
        updatedAt: '2024-11-17T12:30:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: false,
            enableNotifications: true
        }
    },
    {
        id: 'org-7',
        name: 'InnovateFintech',
        type: 'Startup',
        status: 'Inactive',
        usersCount: 12,
        productsCount: 1,
        email: 'contact@innovatefintech.com',
        phone: '+1-555-0147',
        address: '147 Tech Park, Boston, MA 02101',
        logo: 'https://via.placeholder.com/100x100?text=IF',
        createdAt: '2024-01-10T15:00:00Z',
        updatedAt: '2024-09-15T10:45:00Z',
        settings: {
            allowMultipleProducts: false,
            requireApproval: true,
            enableNotifications: false
        }
    },
    {
        id: 'org-8',
        name: 'Enterprise Lending Corp',
        type: 'Corporation',
        status: 'Active',
        usersCount: 678,
        productsCount: 12,
        email: 'business@entlending.com',
        phone: '+1-555-0258',
        address: '258 Enterprise Blvd, Denver, CO 80201',
        logo: 'https://via.placeholder.com/100x100?text=EL',
        createdAt: '2022-09-20T12:15:00Z',
        updatedAt: '2024-11-19T08:45:00Z',
        settings: {
            allowMultipleProducts: true,
            requireApproval: true,
            enableNotifications: true
        }
    }
]

export const getOrganizationById = (id: string): Organization | undefined => {
    return dummyOrganizations.find(org => org.id === id)
}

export const getOrganizationsByType = (type: Organization['type']): Organization[] => {
    return dummyOrganizations.filter(org => org.type === type)
}

export const getOrganizationsByStatus = (status: Organization['status']): Organization[] => {
    return dummyOrganizations.filter(org => org.status === status)
}