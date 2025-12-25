import { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    Stack,
    Group,
    Text,
    UnstyledButton,
    ThemeIcon,
    Collapse,
    Box,
    Badge
} from '@mantine/core'
import {
    IconDashboard,
    IconBuilding,
    IconUsers,
    IconPackage,
    IconChartBar,
    IconSettings,
    IconChevronDown,
    IconChevronRight
} from '@tabler/icons-react'
import { useUI } from '../context/UIContext'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'
import { UserRole, Permission } from '../types/auth.types'

interface NavigationItem {
    label: string
    icon: React.ReactNode
    path?: string
    children?: NavigationItem[]
    allowedRoles?: UserRole[]
    requiredPermissions?: Permission[]
    badge?: string
    disabled?: boolean
}

const navigationData: NavigationItem[] = [
    {
        label: 'Dashboard',
        icon: <IconDashboard size={20} />,
        path: '/dashboard',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        requiredPermissions: [Permission.VIEW_DASHBOARD]
    },
    {
        label: 'Organizations',
        icon: <IconBuilding size={20} />,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        requiredPermissions: [Permission.VIEW_ORGANIZATIONS],
        children: [
            {
                label: 'All Organizations',
                icon: <IconBuilding size={16} />,
                path: '/organizations',
                allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
                requiredPermissions: [Permission.VIEW_ORGANIZATIONS]
            },
            {
                label: 'Add Organization',
                icon: <IconBuilding size={16} />,
                path: '/organizations/create',
                allowedRoles: [UserRole.SUPER_ADMIN],
                requiredPermissions: [Permission.CREATE_ORGANIZATIONS]
            }
        ]
    },
    {
        label: 'Users',
        icon: <IconUsers size={20} />,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
        requiredPermissions: [Permission.VIEW_USERS],
        children: [
            {
                label: 'All Users',
                icon: <IconUsers size={16} />,
                path: '/users',
                allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
                requiredPermissions: [Permission.VIEW_USERS]
            },
            {
                label: 'Add User',
                icon: <IconUsers size={16} />,
                path: '/users/create',
                allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN],
                requiredPermissions: [Permission.CREATE_USERS],
                badge: 'Admin'
            }
        ]
    },
    {
        label: 'Products',
        icon: <IconPackage size={20} />,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
        requiredPermissions: [Permission.VIEW_PRODUCTS],
        children: [
            {
                label: 'All Products',
                icon: <IconPackage size={16} />,
                path: '/products',
                allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
                requiredPermissions: [Permission.VIEW_PRODUCTS]
            },
            {
                label: 'Add Product',
                icon: <IconPackage size={16} />,
                path: '/products/create',
                allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.MEMBER],
                requiredPermissions: [Permission.CREATE_PRODUCTS]
            }
        ]
    },
    {
        label: 'Analytics',
        icon: <IconChartBar size={20} />,
        path: '/analytics',
        allowedRoles: [UserRole.SUPER_ADMIN],
        requiredPermissions: [Permission.VIEW_ANALYTICS],
        badge: 'Pro'
    },
    {
        label: 'Settings',
        icon: <IconSettings size={20} />,
        path: '/settings',
        allowedRoles: [UserRole.SUPER_ADMIN],
        requiredPermissions: [Permission.VIEW_SETTINGS],
        badge: 'Admin'
    }
]

interface NavItemProps {
    item: NavigationItem
    collapsed: boolean
}

const NavItem = ({ item, collapsed }: NavItemProps) => {
    const location = useLocation()
    const [opened, setOpened] = useState(false)

    const hasChildren = item.children && item.children.length > 0
    const isActive = item.path ? location.pathname === item.path : false
    const hasActiveChild = item.children?.some(child => child.path === location.pathname)

    if (hasChildren) {
        return (
            <div>
                <UnstyledButton
                    onClick={() => setOpened(!opened)}
                    w="100%"
                    p="sm"
                    style={{
                        borderRadius: '8px',
                        backgroundColor: hasActiveChild ? 'var(--mantine-color-primary-1)' : 'transparent',
                        color: hasActiveChild ? 'var(--mantine-color-primary-7)' : 'inherit'
                    }}
                >
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap">
                            <ThemeIcon
                                variant={hasActiveChild ? 'light' : 'subtle'}
                                color={hasActiveChild ? 'primary' : 'gray'}
                                size="sm"
                            >
                                {item.icon}
                            </ThemeIcon>
                            {!collapsed && (
                                <Group gap="xs" style={{ flex: 1 }}>
                                    <Text size="sm" fw={hasActiveChild ? 600 : 500}>
                                        {item.label}
                                    </Text>
                                    {item.badge && (
                                        <Badge variant="dot" color="blue" size="xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Group>
                            )}
                        </Group>
                        {!collapsed && (
                            opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />
                        )}
                    </Group>
                </UnstyledButton>

                {!collapsed && (
                    <Collapse in={opened}>
                        <Box pl="lg" pt="xs">
                            <Stack gap="xs">
                                {item.children?.map((child, index) => (
                                    <NavLink
                                        key={index}
                                        to={child.path || '#'}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <UnstyledButton
                                            w="100%"
                                            p="xs"
                                            style={{
                                                borderRadius: '6px',
                                                backgroundColor: location.pathname === child.path
                                                    ? 'var(--mantine-color-primary-2)'
                                                    : 'transparent',
                                                color: location.pathname === child.path
                                                    ? 'var(--mantine-color-primary-8)'
                                                    : 'inherit'
                                            }}
                                        >
                                            <Group gap="sm" justify="space-between">
                                                <Group gap="sm">
                                                    <ThemeIcon
                                                        variant={location.pathname === child.path ? 'light' : 'subtle'}
                                                        color={location.pathname === child.path ? 'primary' : 'gray'}
                                                        size="xs"
                                                    >
                                                        {child.icon}
                                                    </ThemeIcon>
                                                    <Text size="sm" fw={location.pathname === child.path ? 600 : 400}>
                                                        {child.label}
                                                    </Text>
                                                </Group>
                                                {child.badge && (
                                                    <Badge variant="dot" color="orange" size="xs">
                                                        {child.badge}
                                                    </Badge>
                                                )}
                                            </Group>
                                        </UnstyledButton>
                                    </NavLink>
                                ))}
                            </Stack>
                        </Box>
                    </Collapse>
                )}
            </div>
        )
    }

    return (
        <NavLink
            to={item.path || '#'}
            style={{ textDecoration: 'none' }}
        >
            <UnstyledButton
                w="100%"
                p="sm"
                style={{
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--mantine-color-primary-1)' : 'transparent',
                    color: isActive ? 'var(--mantine-color-primary-7)' : 'inherit'
                }}
            >
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon
                        variant={isActive ? 'light' : 'subtle'}
                        color={isActive ? 'primary' : 'gray'}
                        size="sm"
                    >
                        {item.icon}
                    </ThemeIcon>
                    {!collapsed && (
                        <Group gap="xs" justify="space-between" style={{ flex: 1 }}>
                            <Text size="sm" fw={isActive ? 600 : 500}>
                                {item.label}
                            </Text>
                            {item.badge && (
                                <Badge variant="dot" color="blue" size="xs">
                                    {item.badge}
                                </Badge>
                            )}
                        </Group>
                    )}
                </Group>
            </UnstyledButton>
        </NavLink>
    )
}

const Sidebar = () => {
    const { sidebarCollapsed } = useUI()
    const { role } = useAuth()
    const { hasAnyPermission } = usePermissions()

    // Filter navigation items based on user permissions
    const filteredNavigationData = useMemo(() => {
        const filterItems = (items: NavigationItem[]): NavigationItem[] => {
            return items.filter(item => {
                // Check role access
                if (item.allowedRoles && (!role || !item.allowedRoles.includes(role))) {
                    return false
                }

                // Check permission access
                if (item.requiredPermissions && !hasAnyPermission(item.requiredPermissions)) {
                    return false
                }

                // If item has children, filter them recursively
                if (item.children) {
                    const filteredChildren = filterItems(item.children)
                    // Only show parent if it has accessible children or its own path
                    if (filteredChildren.length === 0 && !item.path) {
                        return false
                    }
                    // Update item with filtered children
                    return {
                        ...item,
                        children: filteredChildren
                    }
                }

                return true
            })
        }

        return filterItems(navigationData)
    }, [role, hasAnyPermission])

    return (
        <Stack p="md" gap="xs" h="100%">
            {filteredNavigationData.map((item, index) => (
                <NavItem key={index} item={item} collapsed={sidebarCollapsed} />
            ))}
            {role && (
                <Box mt="auto" pt="md">
                    <Badge
                        variant="light"
                        size="xs"
                        color="gray"
                        fullWidth
                        style={{ opacity: sidebarCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}
                    >
                        Role: {role.replace('_', ' ').toUpperCase()}
                    </Badge>
                </Box>
            )}
        </Stack>
    )
}

export default Sidebar