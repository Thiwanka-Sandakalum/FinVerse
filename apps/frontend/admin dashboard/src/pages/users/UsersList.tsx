import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Group, Button, Avatar, Badge, LoadingOverlay, Text, Select } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import DataTable from '../../components/tables/DataTable'
import { useUsers, useOrganizations } from '../../hooks'
import type { TableColumn } from '../../types'
import type { User } from '../../types/user'

const UsersList = () => {
    const navigate = useNavigate()
    const { users, loading, error, fetchUsers, deleteUser } = useUsers()
    const { organizations, fetchOrganizations } = useOrganizations()

    // Fetch users and organizations on component mount
    useEffect(() => {
        fetchUsers()
        fetchOrganizations()
    }, [fetchUsers, fetchOrganizations])

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'User',
            sortable: true,
            render: (_, item: User) => (
                <Group gap="sm">
                    <Avatar src={item.picture} size="sm" radius="xl">
                        {item.name ? item.name.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600 }}>{item.name || 'Unnamed User'}</div>
                        <div style={{ fontSize: '12px', color: 'gray' }}>{item.email}</div>
                    </div>
                </Group>
            )
        },
        {
            key: 'id',
            label: 'User ID',
            sortable: true,
            render: (value) => (
                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                    {value.substring(0, 8)}...
                </Text>
            )
        },
        {
            key: 'metadata',
            label: 'Role',
            sortable: false,
            render: (value) => {
                const role = value?.role || 'User'
                const color = role === 'Admin' ? 'red' : role === 'Manager' ? 'blue' : 'green'
                return <Badge color={color} variant="light">{role}</Badge>
            }
        }
    ]

    const organizationOptions = organizations.map(org => ({
        label: org.name,
        value: org.id
    }))

    const handleView = (user: User) => {
        console.log('View user:', user)
        // TODO: Navigate to user details page or open modal
    }

    const handleEdit = (user: User) => {
        console.log('Edit user:', user)
        // TODO: Navigate to edit page or open modal
    }

    const handleDelete = (user: User) => {
        modals.openConfirmModal({
            title: 'Deactivate User',
            children: `Are you sure you want to deactivate "${user.name || user.email}"? This action will suspend their access.`,
            labels: { confirm: 'Deactivate', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteUser(user.id)
        })
    }

    const handleOrganizationFilter = (organizationId: string | null) => {
        fetchUsers({ organizationId: organizationId || undefined })
    }

    return (
        <Stack gap="lg" pos="relative">
            <LoadingOverlay visible={loading} />

            <Group justify="space-between">
                <Title order={1}>Users</Title>
                <Group>
                    <Select
                        placeholder="Filter by organization"
                        data={[
                            { label: 'All Organizations', value: '' },
                            ...organizationOptions
                        ]}
                        onChange={handleOrganizationFilter}
                        clearable
                    />
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => navigate('/users/create')}
                    >
                        Add User
                    </Button>
                </Group>
            </Group>

            {error && (
                <Text c="red" size="sm">
                    {error}
                </Text>
            )}

            <DataTable
                data={users}
                columns={columns}
                searchable
                searchPlaceholder="Search users by name or email..."
                actions={{
                    view: handleView,
                    edit: handleEdit,
                    delete: handleDelete
                }}
                onRowClick={handleView}
                itemsPerPage={25}
            />
        </Stack>
    )
}

export default UsersList