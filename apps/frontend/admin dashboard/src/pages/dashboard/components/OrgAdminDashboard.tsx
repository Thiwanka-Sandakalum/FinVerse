/**
 * Organization Admin Dashboard Component
 * Organization-specific management interface for org administrators
 */

import { Grid, Stack, Title, Card, Text, Table, Group, Badge, Button, Progress, Avatar } from '@mantine/core'
import { IconPlus, IconEye, IconSettings, IconUsers, IconPackage, IconTrendingUp, IconUserPlus, IconFileText } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import KPICard from '../../../components/shared/KPICard'
import LineChartCard from '../../../components/charts/LineChartCard'
import BarChartCard from '../../../components/charts/BarChartCard'
import PieChartCard from '../../../components/charts/PieChartCard'
import type { ChartData, KPI, LogItem } from '../../../types'

// Organization Admin specific data
const orgAdminKPIs: KPI[] = [
    {
        title: 'Organization Users',
        value: '234',
        change: 8.4,
        changeType: 'increase',
        icon: 'users',
        color: 'blue'
    },
    {
        title: 'Active Products',
        value: '18',
        change: 12.3,
        changeType: 'increase',
        icon: 'package',
        color: 'green'
    },
    {
        title: 'Monthly Applications',
        value: '89',
        change: -5.2,
        changeType: 'decrease',
        icon: 'file-text',
        color: 'orange'
    },
    {
        title: 'Conversion Rate',
        value: '68%',
        change: 3.1,
        changeType: 'increase',
        icon: 'trending-up',
        color: 'violet'
    }
]

const monthlyApplicationsData: ChartData[] = [
    { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 }, { name: 'Mar', value: 48 },
    { name: 'Apr', value: 67 }, { name: 'May', value: 73 }, { name: 'Jun', value: 82 },
    { name: 'Jul', value: 79 }, { name: 'Aug', value: 71 }, { name: 'Sep', value: 85 },
    { name: 'Oct', value: 91 }, { name: 'Nov', value: 89 }
]

const userActivityData: ChartData[] = [
    { name: 'Week 1', value: 185 }, { name: 'Week 2', value: 192 }, { name: 'Week 3', value: 201 },
    { name: 'Week 4', value: 234 }
]

const productPerformanceData: ChartData[] = [
    { name: 'Personal Loans', value: 32 },
    { name: 'Credit Cards', value: 28 },
    { name: 'Savings Accounts', value: 23 },
    { name: 'Mortgages', value: 17 }
]

const pendingApplications = [
    { id: 'app-1', applicant: 'John Smith', product: 'Personal Loan', amount: '$25,000', status: 'Under Review', priority: 'High', submitted: '2 hours ago' },
    { id: 'app-2', applicant: 'Sarah Johnson', product: 'Credit Card', amount: '$5,000 limit', status: 'Document Required', priority: 'Medium', submitted: '4 hours ago' },
    { id: 'app-3', applicant: 'Mike Davis', product: 'Mortgage', amount: '$320,000', status: 'Initial Review', priority: 'High', submitted: '1 day ago' },
    { id: 'app-4', applicant: 'Emily Chen', product: 'Business Loan', amount: '$75,000', status: 'Awaiting Approval', priority: 'Medium', submitted: '2 days ago' }
]

const teamActivity: LogItem[] = [
    {
        id: 'team-1',
        action: 'Product Approved',
        user: 'Alex Rodriguez',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        details: 'Approved Business Growth Loan v2.1',
        type: 'success'
    },
    {
        id: 'team-2',
        action: 'User Added',
        user: 'Maria Santos',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Added new team member: David Kim',
        type: 'info'
    },
    {
        id: 'team-3',
        action: 'Application Processed',
        user: 'James Wilson',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        details: 'Processed 5 loan applications',
        type: 'success'
    },
    {
        id: 'team-4',
        action: 'Product Updated',
        user: 'Lisa Thompson',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: 'Updated interest rates for Premium Savings',
        type: 'info'
    }
]

export const OrgAdminDashboard = () => {
    const navigate = useNavigate()

    return (
        <Stack gap="lg">
            <Group justify="space-between" align="center">
                <div>
                    <Title order={1}>Organization Dashboard</Title>
                    <Text c="dimmed">TechCorp Financial - Organization Overview</Text>
                </div>
                <Group>
                    <Button variant="light" leftSection={<IconPlus size={16} />}>
                        Add User
                    </Button>
                    <Button variant="light" leftSection={<IconPackage size={16} />}>
                        Create Product
                    </Button>
                    <Button variant="light" leftSection={<IconSettings size={16} />}>
                        Org Settings
                    </Button>
                </Group>
            </Group>

            {/* Organization KPIs */}
            <Grid>
                {orgAdminKPIs.map((kpi, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                        <KPICard data={kpi} />
                    </Grid.Col>
                ))}
            </Grid>

            {/* Application Analytics */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <LineChartCard
                        title="Monthly Applications"
                        data={monthlyApplicationsData}
                        dataKey="value"
                        color="#2196f3"
                        height={350}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <PieChartCard
                        title="Product Performance"
                        data={productPerformanceData}
                        height={350}
                    />
                </Grid.Col>
            </Grid>

            {/* Pending Applications & User Activity */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 7 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <Title order={3}> Applications</Title>
                            <Button variant="subtle" size="sm" leftSection={<IconEye size={16} />}>
                                View All
                            </Button>
                        </Group>

                        <Stack gap="sm">
                            {pendingApplications.map((app) => (
                                <Card key={app.id} padding="sm" radius="sm" withBorder>
                                    <Group justify="space-between">
                                        <div style={{ flex: 1 }}>
                                            <Group gap="sm">
                                                <Avatar size="sm" radius="xl" color="blue">
                                                    {app.applicant.split(' ').map(n => n[0]).join('')}
                                                </Avatar>
                                                <div>
                                                    <Text size="sm" fw={500}>{app.applicant}</Text>
                                                    <Text size="xs" c="dimmed">{app.product} - {app.amount}</Text>
                                                </div>
                                            </Group>
                                        </div>
                                        <div>
                                            <Badge
                                                size="sm"
                                                color={app.priority === 'High' ? 'red' : 'blue'}
                                                variant="light"
                                            >
                                                {app.priority}
                                            </Badge>
                                            <Text size="xs" c="dimmed" mt={4}>{app.submitted}</Text>
                                        </div>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 5 }}>
                    <BarChartCard
                        title="Weekly User Activity"
                        data={userActivityData}
                        dataKey="value"
                        color="#4caf50"
                        height={340}
                    />
                </Grid.Col>
            </Grid>

            {/* Team Performance & Quick Actions */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">Team Activity</Title>
                        <Table.ScrollContainer minWidth={600}>
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Action</Table.Th>
                                        <Table.Th>Team Member</Table.Th>
                                        <Table.Th>Details</Table.Th>
                                        <Table.Th>Time</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {teamActivity.map((activity) => (
                                        <Table.Tr key={activity.id}>
                                            <Table.Td>
                                                <Text fw={500}>{activity.action}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="sm">
                                                    <Avatar size="sm" radius="xl" color="blue">
                                                        {activity.user.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Text>{activity.user}</Text>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text c="dimmed" size="sm">{activity.details}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed">
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">Quick Actions</Title>
                        <Stack gap="sm">
                            <Button
                                fullWidth
                                leftSection={<IconUserPlus size="1rem" />}
                                variant="light"
                                onClick={() => navigate('/users/create')}
                            >
                                Add User to Organization
                            </Button>
                            <Button
                                fullWidth
                                leftSection={<IconPackage size="1rem" />}
                                variant="light"
                                onClick={() => navigate('/products/create')}
                            >
                                Create Product
                            </Button>
                            <Button
                                fullWidth
                                leftSection={<IconSettings size="1rem" />}
                                variant="light"
                                onClick={() => navigate('/organizations')}
                            >
                                Organization Settings
                            </Button>
                            <Button
                                fullWidth
                                leftSection={<IconFileText size="1rem" />}
                                variant="light"
                                onClick={() => navigate('/applications')}
                            >
                                Review Applications
                            </Button>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>
        </Stack>
    )
}