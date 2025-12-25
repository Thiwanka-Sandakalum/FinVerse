/**
 * Super Admin Dashboard Component
 * System-wide overview and management interface for super administrators
 */

import { Grid, Stack, Title, Card, Text, Table, Group, Badge, Button, Alert } from '@mantine/core'
import { IconAlertTriangle, IconBuilding, IconSettings, IconUsers, IconShield } from '@tabler/icons-react'
import KPICard from '../../../components/shared/KPICard'
import LineChartCard from '../../../components/charts/LineChartCard'
import BarChartCard from '../../../components/charts/BarChartCard'
import PieChartCard from '../../../components/charts/PieChartCard'
import { usePermissions } from '../../../hooks/usePermissions'
import type { ChartData, KPI, LogItem } from '../../../types'

// Super Admin specific data (in real app, this would come from API)
const superAdminKPIs: KPI[] = [
    {
        title: 'Total Organizations',
        value: '8',
        change: 12.5,
        changeType: 'increase',
        icon: 'building',
        color: 'blue'
    },
    {
        title: 'Platform Users',
        value: '2,341',
        change: 23.8,
        changeType: 'increase',
        icon: 'users',
        color: 'green'
    },
    {
        title: 'System Products',
        value: '156',
        change: 8.3,
        changeType: 'increase',
        icon: 'package',
        color: 'orange'
    },
    {
        title: 'Platform Revenue',
        value: '$7.5M',
        change: 15.7,
        changeType: 'increase',
        icon: 'currency-dollar',
        color: 'violet'
    }
]

const organizationGrowthData: ChartData[] = [
    { name: 'Jan', value: 2 }, { name: 'Feb', value: 3 }, { name: 'Mar', value: 4 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 6 }, { name: 'Aug', value: 7 }, { name: 'Sep', value: 7 },
    { name: 'Oct', value: 8 }, { name: 'Nov', value: 8 }
]

const platformMetricsData: ChartData[] = [
    { name: 'Jan', value: 1850 }, { name: 'Feb', value: 1920 }, { name: 'Mar', value: 2050 },
    { name: 'Apr', value: 2180 }, { name: 'May', value: 2220 }, { name: 'Jun', value: 2280 },
    { name: 'Jul', value: 2310 }, { name: 'Aug', value: 2285 }, { name: 'Sep', value: 2320 },
    { name: 'Oct', value: 2340 }, { name: 'Nov', value: 2341 }
]

const organizationDistribution: ChartData[] = [
    { name: 'Financial Institutions', value: 3 },
    { name: 'Fintech Startups', value: 2 },
    { name: 'Traditional Banks', value: 2 },
    { name: 'Credit Unions', value: 1 }
]

const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected (CPU: 85%)', timestamp: new Date() },
    { id: 2, type: 'info', message: '2 organizations pending approval', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, type: 'success', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 7200000) }
]

const recentSystemActivity: LogItem[] = [
    {
        id: 'sys-1',
        action: 'Organization Created',
        user: 'TechStart Solutions',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        details: 'New organization registration completed',
        type: 'success'
    },
    {
        id: 'sys-2',
        action: 'Security Alert',
        user: 'System Monitor',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        details: 'Multiple failed login attempts from IP 192.168.1.100',
        type: 'warning'
    },
    {
        id: 'sys-3',
        action: 'System Update',
        user: 'Auto Deployer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Platform updated to v2.1.4 - Security patches applied',
        type: 'info'
    },
    {
        id: 'sys-4',
        action: 'Organization Suspended',
        user: 'SuperAdmin',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: 'QuickLease Partners suspended for compliance review',
        type: 'error'
    }
]

export const SuperAdminDashboard = () => {
    const { hasPermission } = usePermissions()

    return (
        <Stack gap="lg">
            <Group justify="space-between" align="center">
                <Title order={1}>System Overview</Title>
                <Group>
                    <Button variant="light" leftSection={<IconSettings size={16} />}>
                        System Settings
                    </Button>
                    <Button variant="light" leftSection={<IconShield size={16} />}>
                        Security Center
                    </Button>
                </Group>
            </Group>

            {/* System Alerts */}
            {systemAlerts.length > 0 && (
                <Stack gap="xs">
                    {systemAlerts.slice(0, 2).map((alert) => (
                        <Alert
                            key={alert.id}
                            icon={<IconAlertTriangle size={16} />}
                            color={alert.type === 'warning' ? 'yellow' : alert.type === 'info' ? 'blue' : 'green'}
                            variant="light"
                        >
                            <Group justify="space-between">
                                <Text>{alert.message}</Text>
                                <Text size="xs" c="dimmed">
                                    {alert.timestamp.toLocaleTimeString()}
                                </Text>
                            </Group>
                        </Alert>
                    ))}
                </Stack>
            )}

            {/* Super Admin KPIs */}
            <Grid>
                {superAdminKPIs.map((kpi, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                        <KPICard data={kpi} />
                    </Grid.Col>
                ))}
            </Grid>

            {/* Platform Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <LineChartCard
                        title="Platform User Growth"
                        data={platformMetricsData}
                        dataKey="value"
                        color="#2196f3"
                        height={350}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <PieChartCard
                        title="Organization Types"
                        data={organizationDistribution}
                        height={350}
                    />
                </Grid.Col>
            </Grid>

            {/* System Management Cards */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <BarChartCard
                        title="Organization Growth"
                        data={organizationGrowthData}
                        dataKey="value"
                        color="#4caf50"
                        height={300}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder h={300}>
                        <Title order={3} mb="md">Quick Actions</Title>
                        <Stack gap="sm">
                            <Button
                                variant="light"
                                leftSection={<IconBuilding size={16} />}
                                fullWidth
                                justify="start"
                            >
                                Review Pending Organizations (2)
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconUsers size={16} />}
                                fullWidth
                                justify="start"
                            >
                                Manage System Users
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconSettings size={16} />}
                                fullWidth
                                justify="start"
                            >
                                Platform Configuration
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconShield size={16} />}
                                fullWidth
                                justify="start"
                            >
                                Security & Compliance
                            </Button>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* System Activity Logs */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">System Activity</Title>
                <Table.ScrollContainer minWidth={700}>
                    <Table striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Event</Table.Th>
                                <Table.Th>Entity</Table.Th>
                                <Table.Th>Details</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Time</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {recentSystemActivity.map((log) => (
                                <Table.Tr key={log.id}>
                                    <Table.Td>
                                        <Text fw={500}>{log.action}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text>{log.user}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text c="dimmed">{log.details}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                log.type === 'success' ? 'green' :
                                                    log.type === 'warning' ? 'yellow' :
                                                        log.type === 'error' ? 'red' : 'blue'
                                            }
                                            variant="light"
                                        >
                                            {log.type}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" c="dimmed">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Card>
        </Stack>
    )
}