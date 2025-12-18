import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@mantine/core';

const LogoutButton = () => {
    const { logout } = useAuth0();

    const handleLogout = () => {
        // Clear localStorage before Auth0 logout
        // Removed finverse-user localStorage clearing (saved product logic removed)
        localStorage.removeItem('finverse-comparison');

        // Perform Auth0 logout
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <Button
            onClick={handleLogout}
            size="lg"
            variant="gradient"
            gradient={{ from: 'red', to: 'pink' }}
        >
            Log Out
        </Button>
    );
};

export default LogoutButton;