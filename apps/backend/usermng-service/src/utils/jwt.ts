import jwt from 'jsonwebtoken';


// JWKS client instance (will be loaded dynamically)
let jwksClientInstance: any = null;

/**
 * Get JWKS client instance (lazy loading with dynamic import)
 */
async function getJwksClient(): Promise<any> {
    if (!jwksClientInstance) {
        const { default: jwksClient } = await import('jwks-client');
        jwksClientInstance = jwksClient({
            jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: 60000 * 10 // 10 minutes
        });
    }
    return jwksClientInstance;
}

/**
 * Get the signing key for JWT verification
 */
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    getJwksClient()
        .then(client => {
            client.getSigningKey(header.kid!, (err: Error | null, key?: { getPublicKey(): string }) => {
                if (err) {
                    return callback(err);
                }
                const signingKey = key?.getPublicKey();
                callback(null, signingKey);
            });
        })
        .catch(error => {
            callback(error as Error);
        });
}

/**
 * Interface for decoded JWT token
 */
export interface DecodedToken {
    sub: string; // User ID
    aud: string | string[]; // Audience
    iss: string; // Issuer
    exp: number; // Expiration time
    iat: number; // Issued at
    azp?: string; // Authorized party
    scope?: string;
    orgid?: string; // Organization ID
    role?: string; // User role
    [key: string]: any; // Additional claims
}

/**
 * Verify Auth0 JWT token
 * @param token JWT token string
 * @returns Promise with decoded token
 */
export function verifyToken(token: string): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            getKey,
            {
                audience: process.env.AUTH0_API_AUDIENCE,
                issuer: `${process.env.AUTH0_DOMAIN}/`,
                algorithms: ['RS256']
            },
            (err, decoded) => {
                if (err) {
                    reject(new Error(`JWT verification failed: ${err.message}`));
                    return;
                }
                resolve(decoded as DecodedToken);
            }
        );
    });
}

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null
 */
export function extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}