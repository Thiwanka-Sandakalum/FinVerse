import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { UsersService, type User, type Pagination } from '../types/user'

interface UseUsersState {
    users: User[]
    loading: boolean
    error: string | null
    pagination: Pagination | null
}

interface UseUsersFilters {
    organizationId?: string
    page?: number
    limit?: number
}

export const useUsers = () => {
    const [state, setState] = useState<UseUsersState>({
        users: [],
        loading: false,
        error: null,
        pagination: null
    })

    const fetchUsers = useCallback(async (filters: UseUsersFilters = {}) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await UsersService.getUsers(
                filters.organizationId,
                filters.page || 1,
                filters.limit || 25
            )

            setState(prev => ({
                ...prev,
                users: response.items || [],
                pagination: response.pagination || null,
                loading: false
            }))

            return response
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch users'
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

    const getUser = useCallback(async (userId: string): Promise<User> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const user = await UsersService.getUsers1(userId)
            setState(prev => ({ ...prev, loading: false }))
            return user
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to fetch user'
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

    const updateUser = useCallback(async (
        userId: string,
        userData: {
            email?: string
            name?: string
            picture?: string
            metadata?: Record<string, any>
        }
    ): Promise<User> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const updatedUser = await UsersService.putUsers(userId, userData)

            setState(prev => ({
                ...prev,
                users: prev.users.map(user =>
                    user.id === userId ? updatedUser : user
                ),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'User updated successfully',
                color: 'green'
            })

            return updatedUser
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to update user'
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

    const deleteUser = useCallback(async (userId: string): Promise<void> => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            await UsersService.deleteUsers(userId)

            setState(prev => ({
                ...prev,
                users: prev.users.filter(user => user.id !== userId),
                loading: false
            }))

            notifications.show({
                title: 'Success',
                message: 'User deactivated successfully',
                color: 'green'
            })
        } catch (error: any) {
            const errorMessage = error?.body?.message || error?.message || 'Failed to deactivate user'
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
        fetchUsers,
        getUser,
        updateUser,
        deleteUser,
        refetch: fetchUsers
    }
}