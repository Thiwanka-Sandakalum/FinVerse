import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { MembersService, type Member, type Role, type Pagination } from '../types/user'

interface UseMembersState {
    members: Member[]
    loading: boolean
    error: string | null
    pagination: Pagination | null
}

interface UseMembersFilters {
    orgId: string
    page?: number
    limit?: number
}

interface MemberRolesState {
    roles: Role[]
    loading: boolean
    error: string | null
    total: number
}

export const useMembers = () => {
    const [state, setState] = useState<UseMembersState>({
        members: [],
        loading: false,
        error: null,
        pagination: null
    })

    const [rolesState, setRolesState] = useState<MemberRolesState>({
        roles: [],
        loading: false,
        error: null,
        total: 0
    })

    const fetchMembers = useCallback(async (filters: UseMembersFilters) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await MembersService.getOrgsMembers(
                filters.orgId,
                filters.page || 1,
                filters.limit || 25
            )

            setState(prev => ({
                ...prev,
                members: response.items || [],
                pagination: response.pagination || null,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch members'
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

    const removeMembers = useCallback(async (memberIds: string[]): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await MembersService.deleteOrgsMembers({
                members: memberIds
            })

            setState(prev => ({
                ...prev,
                members: prev.members.filter(member => !memberIds.includes(member.userId)),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: `${memberIds.length} member(s) removed successfully`,
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to remove members'
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

    const getMemberRoles = useCallback(async (
        orgId: string,
        userId: string,
        page = 1,
        perPage = 25
    ) => {
        setRolesState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await MembersService.getOrgsMembersRoles(orgId, userId, page, perPage)

            setRolesState(prev => ({
                ...prev,
                roles: response.roles || [],
                total: response.total || 0,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch member roles'
            setRolesState(prev => ({
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

    const assignRolesToMember = useCallback(async (
        orgId: string,
        userId: string,
        roleIds: string[]
    ): Promise<void> => {
        setRolesState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await MembersService.postOrgsMembersRoles(orgId, userId, {
                roles: roleIds
            })

            setRolesState(prev => ({ ...prev, loading: false }))

            notifications.show({
                title: 'Success',
                message: 'Roles assigned successfully',
                color: 'green'
            })

            // Refresh member roles
            await getMemberRoles(orgId, userId)
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to assign roles'
            setRolesState(prev => ({
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
    }, [getMemberRoles])

    const removeMember = useCallback(async (userId: string): Promise<void> => {
        await removeMembers([userId])
    }, [removeMembers])

    return {
        // Members state
        members: state.members,
        loading: state.loading,
        error: state.error,
        pagination: state.pagination,

        // Member roles state
        memberRoles: rolesState.roles,
        rolesLoading: rolesState.loading,
        rolesError: rolesState.error,
        totalRoles: rolesState.total,

        // Actions
        fetchMembers,
        removeMembers,
        removeMember,
        getMemberRoles,
        assignRolesToMember,
        refetch: fetchMembers
    }
}