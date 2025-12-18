import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { OpenAPI } from '../types/products/core/OpenAPI';
import { OpenAPI as UserOpenAPI } from '../types/user/core/OpenAPI';

const AuthTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let isMounted = true;
        const setToken = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    console.log('Obtained Auth0 token:', token);
                    if (isMounted) {
                        OpenAPI.HEADERS = { Authorization: `Bearer ${token}` };
                        UserOpenAPI.HEADERS = { Authorization: `Bearer ${token}` };
                    }
                } else {
                    OpenAPI.HEADERS = {};
                    UserOpenAPI.HEADERS = {};
                }
            } catch {
                OpenAPI.HEADERS = {};
                UserOpenAPI.HEADERS = {};
            }
        };
        setToken();
        return () => { isMounted = false; };
    }, [isAuthenticated, getAccessTokenSilently]);

    return <>{children}</>;
};

export default AuthTokenProvider;
