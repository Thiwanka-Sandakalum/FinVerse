import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { OrganizationsService, type Organization, type Pagination } from '../types/user'

interface UseOrganizationsState {
    organizations: Organization[]
    loading: boolean
    error: string | null
    pagination: Pagination | null
}

interface UseOrganizationsFilters {
    page?: number
    limit?: number
    q?: string // search term
}

interface CreateOrganizationData {
    name: string
    display_name?: string
    metadata: {
        description?: string
        industryType?: Organization.industryType
        registrationNumber?: string
        country?: string
        region?: string
        headquartersAddress?: string
        contactEmail?: string
        contactPhone?: string
        website?: string
        establishedYear?: string
        supportedProducts?: Array<'SavingsAccount' | 'CurrentAccount' | 'FixedDeposit' | 'PersonalLoan' | 'HomeLoan' | 'Leasing' | 'Microfinance' | 'CreditCard' | 'DebitCard' | 'Insurance' | 'LifeInsurance' | 'GeneralInsurance' | 'Investment' | 'StockTrading' | 'UnitTrust' | 'Remittance' | 'MobileBanking' | 'InternetBanking' | 'PaymentGateway' | 'PawnBroking' | 'Other'>
        numberOfBranches?: string
        numberOfEmployees?: string
        logoUrl?: string
        swiftCode?: string
    }
}

interface UpdateOrganizationData {
    name?: string
    metadata?: Record<string, any>
}

export const useOrganizations = () => {
    const [state, setState] = useState<UseOrganizationsState>({
        organizations: [],
        loading: false,
        error: null,
        pagination: null
    })

    const fetchOrganizations = useCallback(async (filters: UseOrganizationsFilters = {}) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await OrganizationsService.getOrgs(
                filters.page || 1,
                filters.limit || 25,
                filters.q
            )

            setState(prev => ({
                ...prev,
                organizations: response.items || [],
                pagination: response.pagination || null,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch organizations'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const getOrganization = useCallback(async (orgId: string): Promise<Organization> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const organization = await OrganizationsService.getOrgs1(orgId)
            setState(prev => ({ ...prev, loading: false }))
            return organization
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch organization'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const createOrganization = useCallback(async (organizationData: CreateOrganizationData): Promise<Organization> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const newOrganization = await OrganizationsService.postOrgs(organizationData)

            setState(prev => ({
                ...prev,
                organizations: [newOrganization, ...prev.organizations],
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Organization created successfully',
                color: 'green'
            })

            return newOrganization
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to create organization'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const updateOrganization = useCallback(async (
        orgId: string,
        organizationData: UpdateOrganizationData
    ): Promise<Organization> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const updatedOrganization = await OrganizationsService.putOrgs(orgId, organizationData)

            setState(prev => ({
                ...prev,
                organizations: prev.organizations.map(org =>
                    org.id === orgId ? updatedOrganization : org
                ),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Organization updated successfully',
                color: 'green'
            })

            return updatedOrganization
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to update organization'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    const deleteOrganization = useCallback(async (orgId: string): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await OrganizationsService.deleteOrgs(orgId)

            setState(prev => ({
                ...prev,
                organizations: prev.organizations.filter(org => org.id !== orgId),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'Organization deleted successfully',
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to delete organization'
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false
            }))
            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red'
            })
            throw error
        }
    }, [])

    return {
        ...state,
        fetchOrganizations,
        getOrganization,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        refetch: fetchOrganizations
    }
}