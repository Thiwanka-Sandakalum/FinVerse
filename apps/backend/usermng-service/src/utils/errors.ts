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

        // Handle specific error cases
        if (statusCode === 404 && parsedError.errorCode === 'inexistent_user') {
            throw new UserNotFoundError(userId || 'unknown');
        }

        // Generic Auth0 error
        throw new Auth0Error(
            parsedError.message || 'Unknown Auth0 error',
            statusCode,
            parsedError.errorCode
        );
    } catch (e) {
        if (e instanceof Auth0Error) {
            throw e;
        }
        // If JSON parsing fails, throw generic Auth0 error
        throw new Auth0Error(error, statusCode);
    }
}