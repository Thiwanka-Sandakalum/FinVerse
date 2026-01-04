import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect } from 'react';
import { UserRole } from '../types/rbac.types';

export const OnboardingGuard = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth0();

    // Extract role and org_id from Auth0 user
    const extractUserRole = (): UserRole | null => {
        if (!user?.role?.roles?.[0]) return null;

        const roleString = user.role.roles[0];

        // Map Auth0 role strings to UserRole enum
        switch (roleString) {
            case 'super_admin':
                return UserRole.SUPER_ADMIN;
            case 'org_admin':
                return UserRole.ORG_ADMIN;
            case 'member':
                return UserRole.MEMBER;
            default:
                return null;
        }
    };

    const userRole = extractUserRole();
    const orgId = user?.orgId;

    // Store role and org_id in window for global access during app initialization
    useEffect(() => {
        if (userRole) {
            (window as any).__userRole = userRole;
            (window as any).__orgId = orgId;
        }
    }, [userRole, orgId]);

    if (isLoading) return null;

    // SuperAdmin doesn't need onboarding (no org_id required)
    if (userRole === UserRole.SUPER_ADMIN) {
        return children;
    }

    // OrgAdmin and Member require onboarding completion
    const onboardingStage = user?.orgId ? 'completed' : undefined;

    if (onboardingStage !== 'completed') {
        return <Navigate to="/onboarding" replace />;
    }

    // OrgAdmin and Member must have org_id
    if ((userRole === UserRole.ORG_ADMIN || userRole === UserRole.MEMBER) && !orgId) {
        console.warn('OrgAdmin/Member user missing orgId:', user);
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};
