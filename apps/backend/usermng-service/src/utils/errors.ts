export class Auth0Error extends Error {
    statusCode: number;
    errorCode?: string;

    constructor(message: string, statusCode: number, errorCode?: string) {
        super(message);
        this.name = 'Auth0Error';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

export class UserNotFoundError extends Auth0Error {
    constructor(userId: string) {
        super(`User not found with ID: ${userId}`, 404, 'inexistent_user');
        this.name = 'UserNotFoundError';
    }
}

export function handleAuth0Error(error: string, statusCode: number, userId?: string): never {
    try {
        const parsedError = JSON.parse(error);
        let userMessage = parsedError.message || 'Unknown Auth0 error';
        let errorCode = parsedError.errorCode || parsedError.error || undefined;

        // Handle specific error cases
        if (statusCode === 404 && errorCode === 'inexistent_user') {
            throw new UserNotFoundError(userId || 'unknown');
        }

        // Friendly mapping for common Auth0 org errors
        if (statusCode === 400) {
            if (userMessage.includes('display_name')) {
                userMessage = 'Display name must be 1-255 characters.';
            } else if (userMessage.includes('name')) {
                userMessage = 'Organization name must be 1-50 characters, lowercase, and only contain letters, numbers, hyphens, or underscores.';
            } else if (userMessage.includes('metadata')) {
                userMessage = 'Metadata must be an object with up to 25 string properties (max 255 chars each).';
            } else if (userMessage.includes('branding')) {
                userMessage = 'Branding must be a valid object with correct logo_url and color formats.';
            }
        }
        if (statusCode === 401) {
            if (userMessage.includes('token')) {
                userMessage = 'Invalid or expired token.';
            } else if (userMessage.includes('signature')) {
                userMessage = 'Invalid signature for JSON Web Token validation.';
            } else if (userMessage.includes('client is not global')) {
                userMessage = 'Client is not global.';
            }
        }
        if (statusCode === 403) {
            userMessage = 'Insufficient scope: you do not have permission to perform this action.';
        }
        if (statusCode === 409) {
            userMessage = 'An organization with this name already exists.';
        }
        if (statusCode === 429) {
            userMessage = 'Too many requests. Please try again later.';
        }

        throw new Auth0Error(userMessage, statusCode, errorCode);
    } catch (e) {
        if (e instanceof Auth0Error) {
            throw e;
        }
        // If JSON parsing fails, throw generic Auth0 error
        throw new Auth0Error(error, statusCode);
    }
}