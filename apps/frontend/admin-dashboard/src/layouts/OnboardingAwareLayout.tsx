import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';

const OnboardingAwareLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth0();
    const onboardingIncomplete = user?.user_metadata?.onboarding_stage !== 'completed';

    if (onboardingIncomplete) {
        // Prevent sidebar flicker during redirect
        return <Outlet />;
    }

    return <Layout>{children}</Layout>;
};

export default OnboardingAwareLayout;
