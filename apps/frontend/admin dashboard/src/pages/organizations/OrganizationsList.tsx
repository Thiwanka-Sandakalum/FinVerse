import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Title, Group, Button, Badge, Text, LoadingOverlay, Avatar } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import DataTable from '../../components/tables/DataTable'
import { useOrganizations } from '../../hooks'
import type { TableColumn } from '../../types'
import type { Organization } from '../../types/user'

const OrganizationsList = () => {
    const navigate = useNavigate()
    const { organizations, loading, error, fetchOrganizations, deleteOrganization } = useOrganizations()

    // Fetch organizations on component mount
    useEffect(() => {
        fetchOrganizations()
    }, [fetchOrganizations])

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Organization Name',
            sortable: true,
            render: (value, item: Organization) => (
                <Group gap="xs">
                    <Avatar src={item.branding?.logo_url || item.metadata?.logoUrl} size="sm" radius="md">
                        {value.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600 }}>{value}</div>
                        <div style={{ fontSize: '12px', color: 'gray' }}>
                            {item.display_name || item.metadata?.description || 'No description'}
                        </div>
                    </div>
                </Group>
            )
        },
        {
            key: 'metadata.industryType',
            label: 'Industry Type',
            sortable: true,
            render: (_, item: Organization) => (
                <Badge variant="outline" color="blue">
                    {item.metadata?.industryType || 'Not specified'}
                </Badge>
            )
        },
        {
            key: 'metadata.country',
            label: 'Country',
            sortable: true,
            render: (_, item: Organization) => item.metadata?.country || 'Not specified'
        },
        {
            key: 'metadata.contactEmail',
            label: 'Contact Email',
            sortable: true,
            render: (_, item: Organization) => (
                <Text size="sm" c="dimmed">
                    {item.metadata?.contactEmail || 'Not provided'}
                </Text>
            )
        },
        {
            key: 'id',
            label: 'Organization ID',
            sortable: false,
            render: (value) => (
                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                    {value.substring(0, 8)}...
                </Text>
            )
        }
    ]

    const industryTypeOptions = [
        'Bank', 'Insurance', 'Fintech', 'CreditUnion', 'InvestmentFirm',
        'PaymentProvider', 'Microfinance', 'LeasingCompany', 'FinanceCompany',
        'StockBroker', 'UnitTrust', 'PawnBroker', 'MoneyTransfer',
        'DevelopmentBank', 'CooperativeSociety', 'InsuranceBroker', 'Other'
    ].map(type => ({ label: type, value: type }))

    const handleView = (organization: Organization) => {
        navigate(`/organizations/${organization.id}`)
    }

    const handleEdit = (organization: Organization) => {
        console.log('Edit organization:', organization)
        // TODO: Navigate to edit page or open modal
    }

    const handleDelete = (organization: Organization) => {
        modals.openConfirmModal({
            title: 'Delete Organization',
            children: `Are you sure you want to delete "${organization.name}"? This action cannot be undone and will remove all associated data.`,
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteOrganization(organization.id)
        })
    }



    return (
        <Stack gap="lg" pos="relative">
            <LoadingOverlay visible={loading} />

            <Group justify="space-between">
                <Title order={1}>Organizations</Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate('/organizations/create')}
                >
                    Add Organization
                </Button>
            </Group>

            {error && (
                <Text c="red" size="sm">
                    {error}
                </Text>
            )}

            <DataTable
                data={organizations}
                columns={columns}
                searchable
                searchPlaceholder="Search organizations by name..."
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

export default OrganizationsList