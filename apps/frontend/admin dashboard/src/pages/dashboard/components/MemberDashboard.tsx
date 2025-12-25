/**
 * Member Dashboard Component
 * Personal dashboard interface for regular members
 */

import { Grid, Stack, Title, Card, Text, Group, Badge, Button } from '@mantine/core'
import { IconSearch, IconFileText, IconUser, IconCheck, IconClock, IconX } from '@tabler/icons-react'
import KPICard from '../../../components/shared/KPICard'
import type { ChartData, KPI, LogItem } from '../../../types'

// Member-specific data
const memberKPIs: KPI[] = [
    {
        title: 'Active Applications',
        value: '3',
        change: 0,
        changeType: 'increase',
        icon: 'file-text',
        color: 'blue'
    },
    {
        title: 'Saved Products',
        value: '12',
        change: 20.0,
        changeType: 'increase',
        icon: 'heart',
        color: 'red'
    },
    {
        title: 'Comparisons Made',
        value: '8',
        change: 14.3,
        changeType: 'increase',
        icon: 'git-compare',
        color: 'green'
    }
]

const myApplications = [
    {
        id: 'app-1',
        productName: 'Personal Loan - Quick Cash',
        amount: '$15,000',
        status: 'Approved',
        appliedDate: '2024-11-15',
        lender: 'TechCorp Bank',
        nextStep: 'Visit branch for documentation'
    },
    {
        id: 'app-2',
        productName: 'Premium Credit Card',
        amount: '$5,000 limit',
        status: 'Under Review',
        appliedDate: '2024-11-18',
        lender: 'FinStart Credit',
        nextStep: 'Awaiting credit verification'
    },
    {
        id: 'app-3',
        productName: 'Home Mortgage',
        amount: '$250,000',
        status: 'Document Required',
        appliedDate: '2024-11-10',
        lender: 'SecureHome Lending',
        nextStep: 'Upload income verification'
    }
]

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'green'
        case 'under review': return 'blue'
        case 'pending': return 'yellow'
        case 'document required': return 'orange'
        case 'rejected': return 'red'
        default: return 'gray'
    }
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return <IconCheck size={16} />
        case 'under review':
        case 'pending': return <IconClock size={16} />
        case 'document required': return <IconFileText size={16} />
        case 'rejected': return <IconX size={16} />
        default: return <IconClock size={16} />
    }
}

export const MemberDashboard = () => {
    return (
        <Stack gap="lg">
            <Group justify="space-between" align="center">
                <div>
                    <Title order={1}>Welcome back, Alex!</Title>
                    <Text c="dimmed">Here's your financial journey overview</Text>
                </div>
                <Group>
                    <Button variant="light" leftSection={<IconSearch size={16} />}>
                        Find Products
                    </Button>
                    <Button variant="light" leftSection={<IconUser size={16} />}>
                        Update Profile
                    </Button>
                </Group>
            </Group>

            {/* Member KPIs */}
            <Grid>
                {memberKPIs.map((kpi, index) => (
                    <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                        <KPICard data={kpi} />
                    </Grid.Col>
                ))}
            </Grid>
        </Stack>
    )
}