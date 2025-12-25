export interface UserProfileResponse {
    id: string;
    fullName: string;
    email: string;
    picture: string;

    phone?: string;
    country?: string;
    city?: string;
    employmentStatus?: string;
    incomeRange?: string;
    financialGoal?: string;
    interestedProduct?: string[];
    preferredLanguage?: string;

    createdAt: string;
    updatedAt: string;
}

// API response structure from Auth0
export interface Auth0UserResponse {
    created_at: string;
    email: string;
    email_verified: boolean;
    family_name?: string;
    given_name?: string;
    identities: Array<{
        provider: string;
        access_token: string;
        expires_in: number;
        user_id: string;
        connection: string;
        isSocial: boolean;
    }>;
    name: string;
    nickname: string;
    picture: string;
    updated_at: string;
    user_id: string;
    user_metadata?: {
        phone?: string;
        country?: string;
        city?: string;
        employmentStatus?: string;
        incomeRange?: string;
        financialGoal?: string;
        interestedProduct?: string[];
        preferredLanguage?: string;
        [key: string]: any;
    };
    last_ip: string;
    last_login: string;
    logins_count: number;
}

// Helper function to map Auth0 response to UserProfileResponse
export const mapAuth0UserToProfile = (auth0User: Auth0UserResponse): UserProfileResponse => {
    return {
        id: auth0User.user_id,
        fullName: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture,
        phone: auth0User.user_metadata?.phone,
        country: auth0User.user_metadata?.country,
        city: auth0User.user_metadata?.city,
        employmentStatus: auth0User.user_metadata?.employmentStatus,
        incomeRange: auth0User.user_metadata?.incomeRange,
        financialGoal: auth0User.user_metadata?.financialGoal,
        interestedProduct: auth0User.user_metadata?.interestedProduct,
        preferredLanguage: auth0User.user_metadata?.preferredLanguage,
        createdAt: auth0User.created_at,
        updatedAt: auth0User.updated_at,
    };
};