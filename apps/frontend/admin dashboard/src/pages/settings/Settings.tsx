import { useState } from 'react'
import {
    Stack,
    Title,
    Tabs,
    Card,
    TextInput,
    Select,
    Switch,
    Button,
    Group,
    Text,
    Badge,
    Table,
    Grid,
    Textarea
} from '@mantine/core'
import { IconSettings, IconPalette, IconUsers, IconActivity } from '@tabler/icons-react'
import { useUI } from '../../context/UIContext'
import { useDummyData } from '../../context/DummyDataContext'

const Settings = () => {
    const { theme, toggleTheme } = useUI()
    const { activityLogs } = useDummyData()

    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'FinVerse Admin',
        adminEmail: 'admin@finverse.com',
        timezone: 'UTC',
        language: 'en',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        sessionTimeout: 60
    })

    const [roles] = useState([
        { id: 1, name: 'Admin', users: 3, permissions: ['All'] },
        { id: 2, name: 'Manager', users: 8, permissions: ['Read', 'Write', 'Delete'] },
        { id: 3, name: 'User', users: 45, permissions: ['Read', 'Write'] },
        { id: 4, name: 'Viewer', users: 12, permissions: ['Read'] }
    ])

    const handleSaveGeneral = () => {
        console.log('Saving general settings:', generalSettings)
        // TODO: Implement save functionality
    }

    return (
        <Stack gap="lg">
            <Title order={1}>Settings</Title>

            <Tabs defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
                        General
                    </Tabs.Tab>
                    <Tabs.Tab value="themes" leftSection={<IconPalette size={16} />}>
                        Appearance
                    </Tabs.Tab>
                    <Tabs.Tab value="roles" leftSection={<IconUsers size={16} />}>
                        Roles & Permissions
                    </Tabs.Tab>
                    <Tabs.Tab value="logs" leftSection={<IconActivity size={16} />}>
                        Activity Logs
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={3}>General Settings</Title>

                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Site Name"
                                        value={generalSettings.siteName}
                                        onChange={(e) => setGeneralSettings(prev => ({
                                            ...prev,
                                            siteName: e.currentTarget.value
                                        }))}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <TextInput
                                        label="Admin Email"
                                        type="email"
                                        value={generalSettings.adminEmail}
                                        onChange={(e) => setGeneralSettings(prev => ({
                                            ...prev,
                                            adminEmail: e.currentTarget.value
                                        }))}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="Timezone"
                                        data={[
                                            { label: 'UTC', value: 'UTC' },
                                            { label: 'EST (UTC-5)', value: 'EST' },
                                            { label: 'PST (UTC-8)', value: 'PST' },
                                            { label: 'GMT (UTC+0)', value: 'GMT' }
                                        ]}
                                        value={generalSettings.timezone}
                                        onChange={(value) => setGeneralSettings(prev => ({
                                            ...prev,
                                            timezone: value || 'UTC'
                                        }))}
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Select
                                        label="Default Language"
                                        data={[
                                            { label: 'English', value: 'en' },
                                            { label: 'Spanish', value: 'es' },
                                            { label: 'French', value: 'fr' },
                                            { label: 'German', value: 'de' }
                                        ]}
                                        value={generalSettings.language}
                                        onChange={(value) => setGeneralSettings(prev => ({
                                            ...prev,
                                            language: value || 'en'
                                        }))}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Stack gap="sm">
                                <Switch
                                    label="Maintenance Mode"
                                    description="Enable maintenance mode to restrict access"
                                    checked={generalSettings.maintenanceMode}
                                    onChange={(e) => setGeneralSettings(prev => ({
                                        ...prev,
                                        maintenanceMode: e.currentTarget.checked
                                    }))}
                                />

                                <Switch
                                    label="Allow User Registration"
                                    description="Allow new users to register accounts"
                                    checked={generalSettings.allowRegistration}
                                    onChange={(e) => setGeneralSettings(prev => ({
                                        ...prev,
                                        allowRegistration: e.currentTarget.checked
                                    }))}
                                />

                                <Switch
                                    label="Require Email Verification"
                                    description="Require users to verify their email addresses"
                                    checked={generalSettings.requireEmailVerification}
                                    onChange={(e) => setGeneralSettings(prev => ({
                                        ...prev,
                                        requireEmailVerification: e.currentTarget.checked
                                    }))}
                                />
                            </Stack>

                            <Group justify="flex-end" mt="lg">
                                <Button onClick={handleSaveGeneral}>
                                    Save Settings
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="themes" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={3}>Appearance Settings</Title>

                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>Theme Mode</Text>
                                    <Text size="sm" c="dimmed">
                                        Current theme: {theme === 'light' ? 'Light' : 'Dark'}
                                    </Text>
                                </div>
                                <Switch
                                    size="lg"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                    onLabel="🌙"
                                    offLabel="☀️"
                                />
                            </Group>

                            <Text size="sm" c="dimmed">
                                More appearance customization options will be available in future updates.
                            </Text>
                        </Stack>
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="roles" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Group justify="space-between">
                                <Title order={3}>Roles & Permissions</Title>
                                <Button variant="light">Add Role</Button>
                            </Group>

                            <Table.ScrollContainer minWidth={600}>
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Role Name</Table.Th>
                                            <Table.Th>Users</Table.Th>
                                            <Table.Th>Permissions</Table.Th>
                                            <Table.Th>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {roles.map(role => (
                                            <Table.Tr key={role.id}>
                                                <Table.Td>
                                                    <Text fw={500}>{role.name}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge variant="light">{role.users}</Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap="xs">
                                                        {role.permissions.map(permission => (
                                                            <Badge key={permission} size="sm" variant="outline">
                                                                {permission}
                                                            </Badge>
                                                        ))}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap="xs">
                                                        <Button size="xs" variant="light">Edit</Button>
                                                        <Button size="xs" variant="light" color="red">Delete</Button>
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        </Stack>
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="logs" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={3}>Activity Logs</Title>

                            <Table.ScrollContainer minWidth={800}>
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Action</Table.Th>
                                            <Table.Th>User</Table.Th>
                                            <Table.Th>Details</Table.Th>
                                            <Table.Th>Time</Table.Th>
                                            <Table.Th>Type</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {activityLogs.slice(0, 15).map(log => (
                                            <Table.Tr key={log.id}>
                                                <Table.Td>
                                                    <Text fw={500}>{log.action}</Text>
                                                </Table.Td>
                                                <Table.Td>{log.user}</Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" c="dimmed">{log.details}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            log.type === 'success' ? 'green' :
                                                                log.type === 'error' ? 'red' :
                                                                    log.type === 'warning' ? 'yellow' : 'blue'
                                                        }
                                                        variant="light"
                                                        size="sm"
                                                    >
                                                        {log.type}
                                                    </Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        </Stack>
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    )
}

export default Settings