import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import {
    Container,
    Text,
    Alert,
    Flex,
    Loader,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { UsersService } from '../types/user';
import { OpenAPI } from '../types/user/core/OpenAPI';

interface AuthWrapperProps {
    children: React.ReactNode;
}

function AuthWrapper({ children }: AuthWrapperProps) {
    const {
        isAuthenticated,
        isLoading,
        error,
        loginWithRedirect,
        getIdTokenClaims
    } = useAuth0();

    const [backendLoading, setBackendLoading] = useState(true);
    const [backendError, setBackendError] = useState<string | null>(null);

    // Auto-login if not authenticated
    useEffect(() => {
        if (!isLoading && !error && !isAuthenticated) {
            loginWithRedirect({
                authorizationParams: {
                    // Optional: include any custom params if needed
                },
            });
        }
    }, [isAuthenticated, isLoading, error, loginWithRedirect]);

    // Call backend after login to handle org/role assignment
    useEffect(() => {
        const callBackend = async () => {
            if (isAuthenticated) {
                try {
                    setBackendLoading(true);
                    setBackendError(null);

                    const idToken = await getIdTokenClaims();

                    // Set Bearer token in OpenAPI config for authentication
                    OpenAPI.TOKEN = idToken?.__raw || '';

                    const response = await UsersService.postUsersLoginCallback({
                        token: idToken?.__raw || ''
                    })
                    console.log('✅ Backend login successful:', response.message);
                } catch (err: any) {
                    console.error(err);
                    setBackendError(err.message || 'Something went wrong with backend');
                } finally {
                    setBackendLoading(false);
                }
            }
        };

        callBackend();
    }, [isAuthenticated, getIdTokenClaims]);

    // Show loading while Auth0 or backend is processing
    if (isLoading || backendLoading) {
        return (
            <Container size="xl" py="xl">
                <Flex direction="column" align="center" justify="center" mih="100vh">
                    <Loader type="dots" size="lg" />
                    <Text mt="md" size="lg">
                        {isLoading ? 'Loading Auth0...' : 'Setting up your account...'}
                    </Text>
                </Flex>
            </Container>
        );
    }

    // Show Auth0 error
    if (error) {
        return (
            <Container size="xl" py="xl">
                <Flex direction="column" align="center" justify="center" mih="100vh">
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Oops!"
                        color="red"
                        variant="filled"
                        maw={400}
                    >
                        <Text size="sm">Something went wrong with Auth0 login.</Text>
                        <Text size="xs" c="dimmed" mt={4}>{error.message}</Text>
                    </Alert>
                </Flex>
            </Container>
        );
    }

    // Show backend error
    if (backendError) {
        return (
            <Container size="xl" py="xl">
                <Flex direction="column" align="center" justify="center" mih="100vh">
                    <Alert
                        icon={<IconAlertCircle size="1rem" />}
                        title="Oops!"
                        color="red"
                        variant="filled"
                        maw={400}
                    >
                        <Text size="sm">Something went wrong while setting up your account.</Text>
                        <Text size="xs" c="dimmed" mt={4}>{backendError}</Text>
                    </Alert>
                </Flex>
            </Container>
        );
    }

    // User is authenticated and backend setup complete
    return <>{children}</>;
}

export default AuthWrapper;
