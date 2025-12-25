import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Stack,
    Title,
    Group,
    Button,
    Card,
    Text,
    Avatar,
    Badge,
    Tabs,
    Grid,
    Divider,
    ActionIcon
} from '@mantine/core'
import { IconArrowLeft, IconEdit, IconUsers, IconPackage, IconActivity } from '@tabler/icons-react'
import DataTable from '../../components/tables/DataTable'
import { useDummyData } from '../../context/DummyDataContext'
import type { Organization, TableColumn } from '../../types'
import OrganizationForm from './OrganizationForm'

const OrganizationDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { organizations, users, products, updateOrganization } = useDummyData()
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        if (id) {
            const found = organizations.find(org => org.id === id)
            setOrganization(found || null)
        }
    }, [id, organizations])

    if (!organization) {
        return (
            <Stack gap="lg">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate('/organizations')}
                    >
                        Back to Organizations
                    </Button>
                </Group>
                <Text>Organization not found</Text>
            </Stack>
        )
    }

    const orgUsers = users.filter(user => user.organizationId === organization.id)
    const orgProducts = products.filter(product => product.organizationId === organization.id)

    const userColumns: TableColumn[] = [
        {
            key: 'firstName',
            label: 'Name',
            render: (value, item: any) => (
                <Group gap="xs">
                    <Avatar src={item.avatar} size="sm" radius="xl">
                        {item.firstName[0]}{item.lastName[0]}
                    </Avatar>
                    <div>
                        <Text fw={500}>{item.firstName} {item.lastName}</Text>
                        <Text size="xs" c="dimmed">{item.email}</Text>
                    </div>
                </Group>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => <Badge variant="light">{value}</Badge>
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const color = value === 'Active' ? 'green' : value === 'Pending' ? 'yellow' : 'red'
                return <Badge color={color}>{value}</Badge>
            }
        },
        {
            key: 'lastLogin',
            label: 'Last Login',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
        }
    ]

    const productColumns: TableColumn[] = [
        {
            key: 'name',
            label: 'Product Name',
            render: (value, item: any) => (
                <div>
                    <Text fw={500}>{value}</Text>
                    <Text size="xs" c="dimmed">{item.category}</Text>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (value) => <Badge variant="outline">{value}</Badge>
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const color = value === 'Active' ? 'green' : value === 'Draft' ? 'yellow' : 'red'
                return <Badge color={color}>{value}</Badge>
            }
        },
        {
            key: 'interestRate',
            label: 'Interest Rate',
            render: (value) => `${value}%`
        }
    ]

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate('/organizations')}
                    >
                        Back to Organizations
                    </Button>
                </Group>
                {!editMode && (
                    <ActionIcon variant="light" onClick={() => setEditMode(true)}>
                        <IconEdit size={16} />
                    </ActionIcon>
                )}
            </Group>
            {editMode ? (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <OrganizationForm
                        initialValues={{
                            name: organization.name,
                            type: organization.type,
                            email: organization.email,
                            phone: organization.phone,
                            address: organization.address,
                            allowMultipleProducts: organization.settings.allowMultipleProducts,
                            requireApproval: organization.settings.requireApproval,
                            enableNotifications: organization.settings.enableNotifications
                        }}
                        submitLabel="Save Changes"
                        cancelLabel="Cancel"
                        onCancel={() => setEditMode(false)}
                        onSubmit={async (values) => {
                            updateOrganization(organization.id, {
                                name: values.name,
                                type: values.type as Organization['type'],
                                email: values.email,
                                phone: values.phone,
                                address: values.address,
                                settings: {
                                    allowMultipleProducts: values.allowMultipleProducts,
                                    requireApproval: values.requireApproval,
                                    enableNotifications: values.enableNotifications
                                }
                            })
                            setEditMode(false)
                        }}
                    />
                </Card>
            ) : (
                <>
                    {/* Organization Header */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group>
                            {organization.logo && (
                                <Avatar src={organization.logo} size="xl" radius="md">
                                    {organization.name[0]}
                                </Avatar>
                            )}
                            <div style={{ flex: 1 }}>
                                <Group justify="space-between" align="flex-start">
                                    <div>
                                        <Title order={2}>{organization.name}</Title>
                                        <Text c="dimmed" mb="xs">{organization.email}</Text>
                                        <Group gap="xs">
                                            <Badge variant="light">{organization.type}</Badge>
                                            <Badge color={organization.status === 'Active' ? 'green' : 'red'}>
                                                {organization.status}
                                            </Badge>
                                        </Group>
                                    </div>
                                    <Grid>
                                        <Grid.Col span={4}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700}>{organization.usersCount}</Text>
                                                <Text size="sm" c="dimmed">Users</Text>
                                            </div>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700}>{organization.productsCount}</Text>
                                                <Text size="sm" c="dimmed">Products</Text>
                                            </div>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700}>
                                                    {Math.floor((Date.now() - new Date(organization.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                                                </Text>
                                                <Text size="sm" c="dimmed">Days</Text>
                                            </div>
                                        </Grid.Col>
                                    </Grid>
                                </Group>
                            </div>
                        </Group>
                        <Divider my="md" />
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Text size="sm" fw={600} mb="xs">Contact Information</Text>
                                <Text size="sm" c="dimmed">Phone: {organization.phone}</Text>
                                <Text size="sm" c="dimmed">Address: {organization.address}</Text>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Text size="sm" fw={600} mb="xs">Settings</Text>
                                <Text size="sm" c="dimmed">
                                    Multiple Products: {organization.settings.allowMultipleProducts ? 'Enabled' : 'Disabled'}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Require Approval: {organization.settings.requireApproval ? 'Yes' : 'No'}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Notifications: {organization.settings.enableNotifications ? 'Enabled' : 'Disabled'}
                                </Text>
                            </Grid.Col>
                        </Grid>
                    </Card>
                    {/* Tabs */}
                    <Tabs defaultValue="users">
                        <Tabs.List>
                            <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
                                Users ({orgUsers.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
                                Products ({orgProducts.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="activity" leftSection={<IconActivity size={16} />}>
                                Activity
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="users" pt="md">
                            <DataTable
                                data={orgUsers}
                                columns={userColumns}
                                searchable
                                searchPlaceholder="Search users..."
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="products" pt="md">
                            <DataTable
                                data={orgProducts}
                                columns={productColumns}
                                searchable
                                searchPlaceholder="Search products..."
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="activity" pt="md">
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Text>Activity logs for this organization will be displayed here.</Text>
                            </Card>
                        </Tabs.Panel>
                    </Tabs>
                </>
            )}
        </Stack>
    )
}

export default OrganizationDetails