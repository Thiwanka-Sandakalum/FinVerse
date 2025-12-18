declare module 'jwks-client' {
    interface SigningKey {
        getPublicKey(): string;
    }

    interface JwksClient {
        getSigningKey(kid: string, callback: (err: Error | null, key?: SigningKey) => void): void;
    }

    interface JwksClientOptions {
        jwksUri: string;
        cache?: boolean;
        cacheMaxEntries?: number;
        cacheMaxAge?: number;
        rateLimit?: boolean;
        jwksRequestsPerMinute?: number;
        timeout?: number;
    }

    declare function jwksClient(options: JwksClientOptions): JwksClient;
    export = jwksClient;
}