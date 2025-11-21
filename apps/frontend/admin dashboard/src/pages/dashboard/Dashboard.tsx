/**
 * Main Dashboard Component with Role-Based Routing
 * Routes users to appropriate dashboard based on their role and permissions
 */

import { LoadingOverlay, Alert, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types/auth.types'
import { SuperAdminDashboard } from './components/SuperAdminDashboard'
import { OrgAdminDashboard } from './components/OrgAdminDashboard'
import { MemberDashboard } from './components/MemberDashboard'

const Dashboard = () => {
    const { user, role, isLoading, error } = useAuth()

    // Show loading state while authentication is being verified
    if (isLoading) {
        return <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />
    }

    // Show error state if authentication failed
    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Authentication Error"
                variant="light"
            >
                <Text>{error}</Text>
            </Alert>
        )
    }

    // Show error if user is not authenticated or role is not available
    if (!user || !role) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                color="yellow"
                title="Access Required"
                variant="light"
            >
                <Text>Please log in to access your dashboard.</Text>
            </Alert>
        )
    }

    // Route to appropriate dashboard based on user role
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return <SuperAdminDashboard />

        case UserRole.ORG_ADMIN:
            return <OrgAdminDashboard />

        default:
            return (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="orange"
                    title="Unknown Role"
                    variant="light"
                >
                    <Text>
                        Your role "{role}" is not recognized. Please contact support for assistance.
                    </Text>
                </Alert>
            )
    }
}

export default Dashboard