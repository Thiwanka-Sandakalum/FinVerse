// Centralized route config with path and label for dynamic page label lookup
export interface RouteMeta {
    path: string;
    label: string;
    children?: RouteMeta[];
}

export const ROUTES: RouteMeta[] = [
    { path: '/dashboard', label: 'Dashboard' },
    {
        path: '/organizations', label: 'Organizations',
        children: [
            { path: '/organizations/create', label: 'Create Organization' },
            { path: '/organizations/:orgId/edit', label: 'Edit Organization' },
            { path: '/organizations/:orgId', label: 'Organization Profile' },
        ]
    },
    {
        path: '/users', label: 'Users',
        children: [
            { path: '/users/create', label: 'Create User' },
            { path: '/users/:userId/edit', label: 'Edit User' },
            { path: '/users/:userId', label: 'User Profile' },
        ]
    },
    {
        path: '/products', label: 'Products',
        children: [
            { path: '/products/create', label: 'Create Product' },
            { path: '/products/:productId/edit', label: 'Edit Product' },
            { path: '/products/:productId', label: 'Product Detail' },
        ]
    },
    { path: '/settings', label: 'Settings' },
    { path: '/login', label: 'Login' },
    { path: '/profile', label: 'My Profile' },
];