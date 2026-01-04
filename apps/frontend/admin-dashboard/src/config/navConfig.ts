/**
 * Dynamic Navigation Configuration
 * Generates navigation items based on user role
 */

import { UserRole } from '@/src/types/rbac.types';
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    Settings,
    LucideIcon
} from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
    badge?: string;
    disabled?: boolean;
}

/**
 * Base navigation items - Dashboard only (Settings moved to end)
 */
const BASE_NAV_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard'
    }
];

/**
 * Settings item - rendered last
 */
const SETTINGS_ITEM: NavItem = {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
};

/**
 * Role-specific navigation items
 */
const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
    [UserRole.SUPER_ADMIN]: [
        {
            id: 'organizations',
            label: 'Organizations',
            icon: Building2,
            path: '/organizations'
        },
        {
            id: 'users',
            label: 'Users',
            icon: Users,
            path: '/users'
        },
        {
            id: 'products',
            label: 'Products',
            icon: CreditCard,
            path: '/products'
        }
    ],

    [UserRole.ORG_ADMIN]: [
        {
            id: 'organization',
            label: 'Organization',
            icon: Building2,
            path: '/organization'
        },
        {
            id: 'users',
            label: 'Users',
            icon: Users,
            path: '/users'
        },
        {
            id: 'products',
            label: 'Products',
            icon: CreditCard,
            path: '/products'
        }
    ],

    [UserRole.MEMBER]: [
        {
            id: 'products',
            label: 'Products',
            icon: CreditCard,
            path: '/products'
        }
    ]
};

/**
 * Get navigation items for a specific user role
 * Returns items in order: Dashboard → Role items → Settings
 * @param role User's role
 * @returns Array of navigation items
 */
export const getNavigationItems = (role: UserRole): NavItem[] => {
    const roleItems = ROLE_NAV_ITEMS[role] || [];
    return [...BASE_NAV_ITEMS, ...roleItems, SETTINGS_ITEM];
};

/**
 * Check if a navigation item should be visible for a role
 * @param role User's role
 * @param itemId Navigation item id
 * @returns true if item should be visible
 */
export const isNavItemVisible = (role: UserRole, itemId: string): boolean => {
    const items = getNavigationItems(role);
    return items.some(item => item.id === itemId);
};

/**
 * Get a single navigation item if visible for role
 * @param role User's role
 * @param itemId Navigation item id
 * @returns Navigation item or undefined
 */
export const getNavItem = (role: UserRole, itemId: string): NavItem | undefined => {
    const items = getNavigationItems(role);
    return items.find(item => item.id === itemId);
};

/**
 * Get tooltip text for why a nav item is disabled
 * @param role User's role
 * @param itemId Navigation item id
 * @returns Tooltip text or undefined
 */
export const getNavItemDisabledReason = (
    role: UserRole,
    itemId: string
): string | undefined => {
    if (isNavItemVisible(role, itemId)) return undefined;

    const reasons: Record<string, string> = {
        organizations: 'Only Super Admins can access Organizations',
        users: 'Only Super Admins and Organization Admins can manage Users'
    };

    return reasons[itemId];
};
