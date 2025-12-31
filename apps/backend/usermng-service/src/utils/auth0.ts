
import { ManagementClient } from 'auth0';

// Token cache interface
interface TokenCache {
    token: string;
    expiresAt: number; // Timestamp in milliseconds
}

// Initialize cache
let tokenCache: TokenCache | null = null;

// Buffer time before token expiry (5 minutes in milliseconds)
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000;

/**
 * Singleton Auth0 ManagementClient instance
 */

/**
 * Get a new Auth0 ManagementClient instance with a valid token
 */
export async function getManagementClient(): Promise<ManagementClient> {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    if (!auth0Domain) {
        throw new Error('AUTH0_DOMAIN environment variable is not defined');
    }
    const token = await getAuth0AccessToken();
    return new ManagementClient({
        domain: auth0Domain.replace(/^https?:\/\//, ''),
        token,
    });
}

/**
 * Fetch a new access token from Auth0
 * @returns {Promise<TokenCache>} The token cache object
 */
async function fetchNewToken(): Promise<TokenCache> {
    try {
        console.log('Fetching new Auth0 access token...', process.env.AUTH0_DOMAIN, process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_SECRET, process.env.AUTH0_AUDIENCE);
        const url = `${process.env.AUTH0_DOMAIN}/oauth/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: process.env.AUTH0_AUDIENCE,
                grant_type: 'client_credentials',
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as { access_token: string; expires_in: number };

        // Calculate expiration time (convert expires_in from seconds to milliseconds)
        const expiresAt = Date.now() + (data.expires_in * 1000);

        return {
            token: data.access_token,
            expiresAt
        };
    } catch (error) {
        console.error('Error fetching Auth0 access token:', error);
        throw error;
    }
}

/**
 * Check if the cached token is still valid
 * @returns {boolean} True if the token is valid and not near expiry
 */
function isTokenValid(): boolean {
    if (!tokenCache) return false;

    // Check if token is about to expire (including buffer time)
    const now = Date.now();
    return now < (tokenCache.expiresAt - TOKEN_EXPIRY_BUFFER);
}

/**
 * Get an Auth0 access token using client credentials grant.
 * Returns cached token if it's still valid, otherwise fetches a new one.
 * @returns {Promise<string>} The access token string
 */
export async function getAuth0AccessToken(): Promise<string> {
    // Return cached token if it's still valid
    if (isTokenValid()) {
        return tokenCache!.token;
    }

    // Fetch new token if cache is invalid or expired
    const newTokenCache = await fetchNewToken();
    tokenCache = newTokenCache;
    return newTokenCache.token;
}
