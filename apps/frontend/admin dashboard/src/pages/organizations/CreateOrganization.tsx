import { useNavigate } from 'react-router-dom'
import {
    Stack,
    Title,
    Card,
    TextInput,
    Select,
    Textarea,
    Button,
    Group,
    Switch,
    FileInput,
    Grid
} from '@mantine/core'
import { IconArrowLeft, IconBuilding } from '@tabler/icons-react'
import { useDummyData } from '../../context/DummyDataContext'
import { useForm } from '../../hooks'
import type { Organization } from '../../types'

interface OrganizationFormData {
    name: string
    type: Organization['type'] | ''
    email: string
    phone: string
    address: string
    allowMultipleProducts: boolean
    requireApproval: boolean
    enableNotifications: boolean
}

const CreateOrganization = () => {
    const navigate = useNavigate()
    const { addOrganization } = useDummyData()

    const validateForm = (values: OrganizationFormData) => {
        const errors: Record<string, string> = {}

        if (!values.name.trim()) {
            errors.name = 'Organization name is required'
        }

        if (!values.type) {
            errors.type = 'Organization type is required'
        }

        if (!values.email.trim()) {
            errors.email = 'Email is required'
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            errors.email = 'Invalid email format'
        }

        return errors
    }

    const form = useForm<OrganizationFormData>({
        initialValues: {
            name: '',
            type: '',
            email: '',
            phone: '',
            address: '',
            allowMultipleProducts: true,
            requireApproval: false,
            enableNotifications: true
        },
        validate: validateForm,
        onSubmit: async (values) => {
            const newOrg: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'> = {
                name: values.name,
                type: values.type as Organization['type'],
                status: 'Active',
                usersCount: 0,
                productsCount: 0,
                email: values.email,
                phone: values.phone,
                address: values.address,
                settings: {
                    allowMultipleProducts: values.allowMultipleProducts,
                    requireApproval: values.requireApproval,
                    enableNotifications: values.enableNotifications
                }
            }

            addOrganization(newOrg)
            navigate('/organizations')
        }
    })



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

            <Title order={1}>Create New Organization</Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <form onSubmit={form.handleSubmit}>
                    <Stack gap="md">
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Organization Name"
                                    placeholder="Enter organization name"
                                    required
                                    value={form.values.name}
                                    onChange={(e) => form.handleChange('name')(e.currentTarget.value)}
                                    error={form.errors.name}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Select
                                    label="Organization Type"
                                    placeholder="Select type"
                                    required
                                    data={[
                                        { label: 'Corporation', value: 'Corporation' },
                                        { label: 'SME', value: 'SME' },
                                        { label: 'Startup', value: 'Startup' },
                                        { label: 'Financial Institution', value: 'Financial Institution' }
                                    ]}
                                    value={form.values.type}
                                    onChange={(value) => form.handleChange('type')(value as Organization['type'])}
                                    error={form.errors.type}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Email"
                                    placeholder="contact@organization.com"
                                    type="email"
                                    required
                                    value={form.values.email}
                                    onChange={(e) => form.handleChange('email')(e.currentTarget.value)}
                                    error={form.errors.email}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <TextInput
                                    label="Phone"
                                    placeholder="+1-555-0123"
                                    value={form.values.phone}
                                    onChange={(e) => form.handleChange('phone')(e.currentTarget.value)}
                                    error={form.errors.phone}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="Address"
                            placeholder="Enter full address"
                            rows={3}
                            value={form.values.address}
                            onChange={(e) => form.handleChange('address')(e.currentTarget.value)}
                            error={form.errors.address}
                        />

                        <FileInput
                            label="Logo"
                            placeholder="Upload organization logo"
                            leftSection={<IconBuilding size={16} />}
                            accept="image/*"
                        />

                        <Card withBorder padding="md" mt="lg">
                            <Title order={4} mb="md">Organization Settings</Title>

                            <Stack gap="sm">
                                <Switch
                                    label="Allow Multiple Products"
                                    description="Allow this organization to have multiple product offerings"
                                    checked={form.values.allowMultipleProducts}
                                    onChange={(e) => form.handleChange('allowMultipleProducts')(e.currentTarget.checked)}
                                />

                                <Switch
                                    label="Require Approval"
                                    description="Require admin approval for new products and changes"
                                    checked={form.values.requireApproval}
                                    onChange={(e) => form.handleChange('requireApproval')(e.currentTarget.checked)}
                                />

                                <Switch
                                    label="Enable Notifications"
                                    description="Send email notifications for important updates"
                                    checked={form.values.enableNotifications}
                                    onChange={(e) => form.handleChange('enableNotifications')(e.currentTarget.checked)}
                                />
                            </Stack>
                        </Card>

                        <Group justify="flex-end" mt="xl">
                            <Button
                                variant="light"
                                onClick={() => navigate('/organizations')}
                                disabled={form.isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={form.isSubmitting}
                                disabled={!form.isValid}
                            >
                                Create Organization
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Card>
        </Stack>
    )
}

export default CreateOrganization