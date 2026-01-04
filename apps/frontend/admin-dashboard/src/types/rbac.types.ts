/**
 * RBAC Type Definitions
 * Defines roles, permissions, and auth user structure
 */

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ORG_ADMIN = 'org_admin',
    MEMBER = 'member'
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';

export interface RolePermission {
    view: string[];      // Pages user can view
    create: string[];    // Resources user can create
    edit: string[];      // Resources user can edit
    delete: string[];    // Resources user can delete
    manage: string[];    // Full management access
}

export interface AuthUser {
    user_id: string;
    name: string;
    email: string;
    role: UserRole;
    org_id?: string;
    org_name?: string;
    email_verified: boolean;
    picture?: string;
    created_at: string;
    updated_at?: string;
}

export interface RoleConfig {
    [UserRole.SUPER_ADMIN]: RolePermission;
    [UserRole.ORG_ADMIN]: RolePermission;
    [UserRole.MEMBER]: RolePermission;
}

export interface AccessDeniedProps {
    resource?: string;
    action?: string;
    onGoBack?: () => void;
}
