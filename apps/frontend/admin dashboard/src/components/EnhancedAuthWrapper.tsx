/**
 * Enhanced AuthWrapper with Backend Integration
 * Handles Auth0 authentication + backend user management integration
 */

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import {
    Container,
    Text,
    Alert,
    Flex,
    Loader,
    Button,
    Stack
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { authService, type EnhancedUserProfile } from '../services/auth.service';

interface AuthWrapperProps {
    children: React.ReactNode;
}

interface AuthState {
    isBackendProcessed: boolean;
    backendUser: EnhancedUserProfile | null;
    backendError: string | null;
    isProcessing: boolean;
}

function EnhancedAuthWrapper({ children }: AuthWrapperProps) {
    const {
        isAuthenticated,
        isLoading,
        error: auth0Error,
        loginWithRedirect,
        getAccessTokenSilently,
        user: auth0User
    } = useAuth0();

    const [authState, setAuthState] = useState<AuthState>({
        isBackendProcessed: false,
        backendUser: null,
        backendError: null,
        isProcessing: false
    });

    // Auto-login when user is not authenticated
    useEffect(() => {
        if (!isLoading && !auth0Error && !isAuthenticated) {
            console.log('🔐 User not authenticated, redirecting to Auth0...');
            loginWithRedirect({
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    scope: 'openid profile email',
                    // Set user_metadata for company users (you can modify this based on your needs)
                    user_metadata: JSON.stringify({
                        isCompany: true // You can make this dynamic based on sign-up flow
                    }),
                },
            });
        }
    }, [isAuthenticated, isLoading, auth0Error, loginWithRedirect]);

    // Process backend authentication when Auth0 auth completes
    useEffect(() => {
        const processBackendAuth = async () => {
            if (
                isAuthenticated &&
                auth0User &&
                !authState.isBackendProcessed &&
                !authState.isProcessing
            ) {
                setAuthState(prev => ({ ...prev, isProcessing: true, backendError: null }));

                try {
                    console.log('🚀 Processing backend authentication for user:', auth0User.email);

                    // Get access token from Auth0
                    const accessToken = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: 'usermng-service', // Your API identifier
                            scope: 'openid profile email'
                        }
                    });

                    console.log('🔑 Obtained access token, calling backend...');

                    // Call our backend login callback
                    const backendUser = await authService.handleLoginCallback(accessToken);

                    console.log('✅ Backend authentication successful:', backendUser);

                    setAuthState({
                        isBackendProcessed: true,
                        backendUser,
                        backendError: null,
                        isProcessing: false
                    });

                } catch (error) {
                    console.error('❌ Backend authentication failed:', error);
                    setAuthState(prev => ({
                        ...prev,
                        backendError: error instanceof Error ? error.message : 'Backend authentication failed',
                        isProcessing: false,
                        isBackendProcessed: false
                    }));
                }
            }
        };

        processBackendAuth();
    }, [isAuthenticated, auth0User, getAccessTokenSilently, authState.isBackendProcessed, authState.isProcessing]);

    // Retry backend authentication
    const retryBackendAuth = () => {
        setAuthState(prev => ({
            ...prev,
            isBackendProcessed: false,
            backendError: null,
            isProcessing: false
        }));
    };

    // Loading state - Auth0 is still loading
    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    mih="100vh"
                >
                    <Loader type="dots" size="lg" />
                    <Text mt="md" size="lg">Initializing authentication...</Text>
                </Flex>
            </Container>
        );
    }

    // Auth0 error
    if (auth0Error) {
        return (
            <Container size="xl" py="xl">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    mih="100vh"
                >
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Authentication Error"
                        color="red"
                        variant="filled"
                        maw={400}
                    >
                        <Text size="sm">Authentication failed</Text>
                        <Text size="xs" c="dimmed" mt={4}>{auth0Error.message}</Text>
                    </Alert>
                </Flex>
            </Container>
        );
    }

    // Not authenticated by Auth0
    if (!isAuthenticated) {
        return (
            <Container size="xl" py="xl">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    mih="100vh"
                >
                    <Loader type="bars" size="lg" />
                    <Text mt="md" size="lg">Redirecting to login...</Text>
                </Flex>
            </Container>
        );
    }

    // Backend processing
    if (authState.isProcessing) {
        return (
            <Container size="xl" py="xl">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    mih="100vh"
                >
                    <Loader type="dots" size="lg" />
                    <Text mt="md" size="lg">Setting up your account...</Text>
                    <Text size="sm" c="dimmed" mt={4}>
                        Configuring roles and organization access
                    </Text>
                </Flex>
            </Container>
        );
    }

    // Backend error
    if (authState.backendError) {
        return (
            <Container size="xl" py="xl">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    mih="100vh"
                >
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Setup Error"
                        color="orange"
                        variant="filled"
                        maw={500}
                    >
                        <Stack gap="sm">
                            <Text size="sm">
                                Failed to complete account setup
                            </Text>
                            <Text size="xs" c="dimmed">
                                {authState.backendError}
                            </Text>
                            <Button
                                size="xs"
                                variant="white"
                                leftSection={<IconRefresh size={16} />}
                                onClick={retryBackendAuth}
                            >
                                Retry Setup
                            </Button>
                        </Stack>
                    </Alert>
                </Flex>
            </Container>
        );
    }

    // Success - user is authenticated and backend processed
    if (authState.isBackendProcessed && authState.backendUser) {
        console.log('🎉 Authentication complete! User ready:', authState.backendUser);

        // Store user data in localStorage for the application to use
        localStorage.setItem('enhancedUser', JSON.stringify(authState.backendUser));

        return <>{children}</>;
    }

    // Fallback loading state
    return (
        <Container size="xl" py="xl">
            <Flex
                direction="column"
                align="center"
                justify="center"
                mih="100vh"
            >
                <Loader type="dots" size="lg" />
                <Text mt="md" size="lg">Completing setup...</Text>
            </Flex>
        </Container>
    );
}

export default EnhancedAuthWrapper;