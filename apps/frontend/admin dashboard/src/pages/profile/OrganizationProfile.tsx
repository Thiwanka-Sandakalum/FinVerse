/**
 * Organization Profile Page for Organization Administrators
 * Allows org_admin to view and edit organization details
 */

import { useState, useEffect } from 'react'
import {
    Stack,
    Title,
    Card,
    Grid,
    TextInput,
    Button,
    Group,
    Text,
    Badge,
    Avatar,
    Divider,
    Select,
    Switch,
    Alert
} from '@mantine/core'
import {
    IconBuilding,
    IconEdit,
    IconDeviceFloppy,
    IconX,
    IconMail,
    IconPhone,
    IconMapPin,
    IconInfoCircle
} from '@tabler/icons-react'
import { useDummyData } from '../../context/DummyDataContext'
import type { Organization } from '../../types'

const OrganizationProfile = () => {
    const { organizations, updateOrganization } = useDummyData()
    const [editMode, setEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [organization, setOrganization] = useState<Organization | null>(null)

    // For demo purposes, we'll assume the org_admin manages the first organization
    // In a real app, this would come from the user's organization association
    useEffect(() => {
        if (organizations.length > 0) {
            setOrganization(organizations[0])
        }
    }, [organizations])

    const [formData, setFormData] = useState({
        name: '',
        type: '' as Organization['type'],
        email: '',
        phone: '',
        address: '',
        isActive: true,
        allowMultipleProducts: true,
        requireApproval: false,
        enableNotifications: true
    })

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                type: organization.type || 'Corporation',
                email: organization.email || '',
                phone: organization.phone || '',
                address: organization.address || '',
                isActive: organization.status === 'Active',
                allowMultipleProducts: organization.settings?.allowMultipleProducts ?? true,
                requireApproval: organization.settings?.requireApproval ?? false,
                enableNotifications: organization.settings?.enableNotifications ?? true
            })
        }
    }, [organization])

    const handleSave = async () => {
        if (!organization) return

        setSaving(true)
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const updatedOrg: Organization = {
                ...organization,
                name: formData.name,
                type: formData.type,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                status: formData.isActive ? 'Active' : 'Inactive',
                settings: {
                    allowMultipleProducts: formData.allowMultipleProducts,
                    requireApproval: formData.requireApproval,
                    enableNotifications: formData.enableNotifications
                },
                updatedAt: new Date().toISOString()
            }

            updateOrganization(organization.id, updatedOrg)
            setOrganization(updatedOrg)
            setEditMode(false)
        } catch (error) {
            console.error('Error updating organization:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                type: organization.type || 'Corporation',
                email: organization.email || '',
                phone: organization.phone || '',
                address: organization.address || '',
                isActive: organization.status === 'Active',
                allowMultipleProducts: organization.settings?.allowMultipleProducts ?? true,
                requireApproval: organization.settings?.requireApproval ?? false,
                enableNotifications: organization.settings?.enableNotifications ?? true
            })
        }
        setEditMode(false)
    }

    if (!organization) {
        return (
            <Stack gap="lg">
                <Alert icon={<IconInfoCircle size="1rem" />} title="No Organization Found" color="blue">
                    No organization data available for your account. Please contact your administrator.
                </Alert>
            </Stack>
        )
    }

    return (
        <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between">
                <Group>
                    <Avatar size="lg" radius="md" color="blue">
                        <IconBuilding size="1.5rem" />
                    </Avatar>
                    <div>
                        <Title order={2}>{organization.name}</Title>
                        <Text c="dimmed">Organization Profile</Text>
                    </div>
                </Group>
                <Group>
                    <Badge color={organization.status === 'Active' ? 'green' : 'red'} size="lg">
                        {organization.status}
                    </Badge>
                    {!editMode ? (
                        <Button
                            leftSection={<IconEdit size="1rem" />}
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Group>
                            <Button
                                leftSection={<IconDeviceFloppy size="1rem" />}
                                onClick={handleSave}
                                loading={saving}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconX size="1rem" />}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Group>
                    )}
                </Group>
            </Group>

            <Grid>
                {/* Organization Details */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={3}>Organization Details</Title>
                            <Divider />

                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Organization Name"
                                        placeholder="Enter organization name"
                                        value={formData.name}
                                        onChange={(event) => setFormData({ ...formData, name: event.currentTarget.value })}
                                        disabled={!editMode}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="Organization Type"
                                        placeholder="Select organization type"
                                        value={formData.type}
                                        onChange={(value) => setFormData({ ...formData, type: (value as Organization['type']) || 'Corporation' })}
                                        disabled={!editMode}
                                        data={[
                                            { value: 'Corporation', label: 'Corporation' },
                                            { value: 'SME', label: 'Small & Medium Enterprise' },
                                            { value: 'Startup', label: 'Startup' },
                                            { value: 'Financial Institution', label: 'Financial Institution' }
                                        ]}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Email"
                                        placeholder="organization@example.com"
                                        value={formData.email}
                                        onChange={(event) => setFormData({ ...formData, email: event.currentTarget.value })}
                                        disabled={!editMode}
                                        leftSection={<IconMail size="1rem" />}
                                        type="email"
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Phone"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={(event) => setFormData({ ...formData, phone: event.currentTarget.value })}
                                        disabled={!editMode}
                                        leftSection={<IconPhone size="1rem" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <TextInput
                                        label="Address"
                                        placeholder="123 Main St, City, State 12345"
                                        value={formData.address}
                                        onChange={(event) => setFormData({ ...formData, address: event.currentTarget.value })}
                                        disabled={!editMode}
                                        leftSection={<IconMapPin size="1rem" />}
                                    />
                                </Grid.Col>
                            </Grid>

                            {editMode && (
                                <>
                                    <Divider />
                                    <Title order={4}>Organization Settings</Title>
                                    <Grid>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            <Switch
                                                label="Organization Active"
                                                description="Enable/disable organization"
                                                checked={formData.isActive}
                                                onChange={(event) => setFormData({ ...formData, isActive: event.currentTarget.checked })}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            <Switch
                                                label="Multiple Products"
                                                description="Allow multiple products per user"
                                                checked={formData.allowMultipleProducts}
                                                onChange={(event) => setFormData({ ...formData, allowMultipleProducts: event.currentTarget.checked })}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            <Switch
                                                label="Require Approval"
                                                description="Require admin approval for applications"
                                                checked={formData.requireApproval}
                                                onChange={(event) => setFormData({ ...formData, requireApproval: event.currentTarget.checked })}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </>
                            )}
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Organization Stats */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Stack gap="md">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Organization Stats</Title>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Created</Text>
                                    <Text size="sm" fw={500}>
                                        {new Date(organization.createdAt).toLocaleDateString()}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Last Updated</Text>
                                    <Text size="sm" fw={500}>
                                        {new Date(organization.updatedAt).toLocaleDateString()}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Total Users</Text>
                                    <Text size="sm" fw={500}>{organization.usersCount || 0}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Total Products</Text>
                                    <Text size="sm" fw={500}>{organization.productsCount || 0}</Text>
                                </Group>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Profile Help</Title>
                            <Stack gap="sm">
                                <Text size="sm" c="dimmed">
                                    Keep your organization profile updated to ensure accurate information
                                    is displayed to users and in reports.
                                </Text>
                                <Button variant="light" size="sm" fullWidth>
                                    Contact Support
                                </Button>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    )
}

export default OrganizationProfile