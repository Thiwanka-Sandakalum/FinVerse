import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Stack,
    Title,
    Card,
    TextInput,
    Select,
    Button,
    Group,
    Grid,
    MultiSelect,
    SegmentedControl,
    Text,
    Textarea,
    Alert
} from '@mantine/core'
import { IconArrowLeft, IconMail, IconUserPlus, IconInfoCircle } from '@tabler/icons-react'
import { useDummyData } from '../../context/DummyDataContext'
import type { User } from '../../types'

const CreateUser = () => {
    const navigate = useNavigate()
    const { addUser, organizations } = useDummyData()

    const [creationMode, setCreationMode] = useState<'create' | 'invite'>('create')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '' as User['role'],
        organizationId: '',
        status: 'Active' as User['status'],
        permissions: [] as string[]
    })

    const [inviteData, setInviteData] = useState({
        email: '',
        role: '' as User['role'] | '',
        organizationId: '',
        message: ''
    })

    const [loading, setLoading] = useState(false)
    const [inviteSuccess, setInviteSuccess] = useState(false)

    const organizationOptions = organizations.map(org => ({
        label: org.name,
        value: org.id
    }))

    const permissionOptions = [
        { label: 'Manage Users', value: 'manage_users' },
        { label: 'Manage Products', value: 'manage_products' },
        { label: 'View Analytics', value: 'view_analytics' },
        { label: 'Manage Settings', value: 'manage_settings' },
        { label: 'Export Data', value: 'export_data' },
        { label: 'Audit Logs', value: 'audit_logs' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (creationMode === 'create') {
                const selectedOrg = organizations.find(org => org.id === formData.organizationId)

                const newUser: Omit<User, 'id' | 'createdAt'> = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    organizationId: formData.organizationId || undefined,
                    organizationName: selectedOrg?.name,
                    status: formData.status,
                    permissions: formData.permissions
                }

                addUser(newUser)
                navigate('/users')
            } else {
                // Handle invite user
                await handleInviteUser()
            }
        } catch (error) {
            console.error('Error creating user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInviteUser = async () => {
        try {
            // In a real app, this would send an email invitation
            console.log('Sending invitation to:', inviteData.email)
            console.log('Invite data:', inviteData)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setInviteSuccess(true)

            // Reset form after successful invite
            setTimeout(() => {
                setInviteSuccess(false)
                setInviteData({
                    email: '',
                    role: '' as User['role'] | '',
                    organizationId: '',
                    message: ''
                })
            }, 3000)
        } catch (error) {
            console.error('Error sending invitation:', error)
        }
    }

    return (
        <Stack gap="lg">
            <Group>
                <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => navigate('/users')}
                >
                    Back to Users
                </Button>
            </Group>

            <Title order={1}>Add New User</Title>

            {/* Mode Selection */}
            <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" align="center">
                    <Text size="sm" fw={500}>Choose how to add the user:</Text>
                    <SegmentedControl
                        value={creationMode}
                        onChange={(value: string) => setCreationMode(value as 'create' | 'invite')}
                        data={[
                            {
                                label: (
                                    <Group gap="xs">
                                        <IconUserPlus size="1rem" />
                                        <span>Create User</span>
                                    </Group>
                                ),
                                value: 'create'
                            },
                            {
                                label: (
                                    <Group gap="xs">
                                        <IconMail size="1rem" />
                                        <span>Invite User</span>
                                    </Group>
                                ),
                                value: 'invite'
                            }
                        ]}
                    />
                </Group>
            </Card>

            {/* Success Alert for Invitations */}
            {inviteSuccess && (
                <Alert
                    icon={<IconInfoCircle size="1rem" />}
                    title="Invitation Sent Successfully!"
                    color="green"
                    variant="light"
                >
                    An invitation email has been sent to {inviteData.email}. They will receive instructions to complete their account setup.
                </Alert>
            )}

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        {creationMode === 'create' ? (
                            <>
                                {/* Create User Form */}
                                <Grid>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="First Name"
                                            placeholder="Enter first name"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.currentTarget.value }))}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Last Name"
                                            placeholder="Enter last name"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.currentTarget.value }))}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Grid>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Email"
                                            placeholder="user@example.com"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.currentTarget.value }))}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <TextInput
                                            label="Phone"
                                            placeholder="+1-555-0123"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.currentTarget.value }))}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Grid>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Select
                                            label="Role"
                                            placeholder="Select user role"
                                            required
                                            data={[
                                                { label: 'Admin', value: 'Admin' },
                                                { label: 'Manager', value: 'Manager' },
                                                { label: 'User', value: 'User' },
                                                { label: 'Viewer', value: 'Viewer' }
                                            ]}
                                            value={formData.role}
                                            onChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Select
                                            label="Organization"
                                            placeholder="Assign to organization"
                                            data={organizationOptions}
                                            value={formData.organizationId}
                                            onChange={(value) => setFormData(prev => ({ ...prev, organizationId: value || '' }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Select
                                    label="Status"
                                    placeholder="Select status"
                                    data={[
                                        { label: 'Active', value: 'Active' },
                                        { label: 'Inactive', value: 'Inactive' },
                                        { label: 'Pending', value: 'Pending' }
                                    ]}
                                    value={formData.status}
                                    onChange={(value) => setFormData(prev => ({ ...prev, status: value as User['status'] }))}
                                />

                                <MultiSelect
                                    label="Permissions"
                                    placeholder="Select user permissions"
                                    data={permissionOptions}
                                    value={formData.permissions}
                                    onChange={(value: any) => setFormData(prev => ({ ...prev, permissions: value }))}
                                    description="Select the permissions this user should have"
                                />
                            </>
                        ) : (
                            <>
                                {/* Invite User Form */}
                                <Alert
                                    icon={<IconInfoCircle size="1rem" />}
                                    title="Invite User"
                                    color="blue"
                                    variant="light"
                                >
                                    Send an email invitation to a new user. They will receive a secure link to complete their registration and set up their account.
                                </Alert>

                                <TextInput
                                    label="Email Address"
                                    placeholder="user@example.com"
                                    type="email"
                                    required
                                    leftSection={<IconMail size="1rem" />}
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.currentTarget.value }))}
                                    description="The user will receive an invitation at this email address"
                                />

                                <Grid>
                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Select
                                            label="Role"
                                            placeholder="Select user role"
                                            required
                                            data={[
                                                { label: 'Admin', value: 'Admin' },
                                                { label: 'Manager', value: 'Manager' },
                                                { label: 'User', value: 'User' },
                                                { label: 'Viewer', value: 'Viewer' }
                                            ]}
                                            value={inviteData.role}
                                            onChange={(value) => setInviteData(prev => ({ ...prev, role: value as User['role'] | '' }))}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 12, md: 6 }}>
                                        <Select
                                            label="Organization"
                                            placeholder="Assign to organization"
                                            data={organizationOptions}
                                            value={inviteData.organizationId}
                                            onChange={(value) => setInviteData(prev => ({ ...prev, organizationId: value || '' }))}
                                            clearable
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Textarea
                                    label="Personal Message (Optional)"
                                    placeholder="Add a personal message to the invitation email..."
                                    value={inviteData.message}
                                    onChange={(e) => setInviteData(prev => ({ ...prev, message: e.currentTarget.value }))}
                                    minRows={3}
                                    description="This message will be included in the invitation email"
                                />
                            </>
                        )}

                        <Group justify="flex-end" mt="xl">
                            <Button
                                variant="light"
                                onClick={() => navigate('/users')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={
                                    creationMode === 'create'
                                        ? !formData.firstName || !formData.lastName || !formData.email || !formData.role
                                        : !inviteData.email || !inviteData.role
                                }
                                leftSection={creationMode === 'create' ? <IconUserPlus size="1rem" /> : <IconMail size="1rem" />}
                            >
                                {creationMode === 'create' ? 'Create User' : 'Send Invitation'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Card>
        </Stack>
    )
}

export default CreateUser