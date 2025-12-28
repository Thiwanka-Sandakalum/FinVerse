/**
 * Centralized environment configuration
 * All environment variables are accessed and validated here
 */

interface EnvConfig {
    // Server
    PORT: number;
    NODE_ENV: string;

    // Auth0
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_AUDIENCE: string;
    AUTH0_API_AUDIENCE: string;

    // Roles
    ORG_ADMIN_ROLE_ID?: string;

    // Invitations
    INVITATION_CLIENT_ID?: string;
}

// Validate required environment variables
function validateEnv(): EnvConfig {
    const requiredVars = [
        'AUTH0_DOMAIN',
        'AUTH0_CLIENT_ID',
        'AUTH0_CLIENT_SECRET',
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        PORT: parseInt(process.env.PORT || '3000', 10),
        NODE_ENV: process.env.NODE_ENV || 'development',

        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN!,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'usermng-service',
        AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE!,

        ORG_ADMIN_ROLE_ID: process.env.ORG_ADMIN_ROLE_ID,
        INVITATION_CLIENT_ID: process.env.INVITATION_CLIENT_ID,
    };
}

export const config = validateEnv();
