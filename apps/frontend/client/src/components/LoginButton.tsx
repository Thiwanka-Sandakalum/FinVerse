import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@mantine/core';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <Button
            onClick={() => loginWithRedirect()}
            size="lg"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
        >
            Log In
        </Button>
    );
};

export default LoginButton;