import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { OpenAPI as ProductAPI } from '../types/products/core/OpenAPI';
import { OpenAPI as UserAPI } from '../types/user/core/OpenAPI';

const AuthTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let isMounted = true;

        const setToken = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: "usermng-service", // correct audience
                        }
                    });

                    console.log('✅ Obtained API token:', token);

                    if (isMounted) {
                        ProductAPI.HEADERS = { Authorization: `Bearer ${token}` };
                        UserAPI.HEADERS = { Authorization: `Bearer ${token}` };
                    }
                } else {
                    ProductAPI.HEADERS = {};
                    UserAPI.HEADERS = {};
                }
            } catch (err) {
                console.error('Failed to get token', err);
                ProductAPI.HEADERS = {};
                UserAPI.HEADERS = {};
            }
        };

        setToken();
        return () => { isMounted = false; };
    }, [isAuthenticated, getAccessTokenSilently]);

    return <>{children}</>;
};

export default AuthTokenProvider;
