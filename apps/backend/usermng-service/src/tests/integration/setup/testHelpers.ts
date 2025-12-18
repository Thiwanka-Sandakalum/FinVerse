/**
 * Integration Test Helpers
 * Common utilities for API integration testing
 */

import { Response } from 'supertest';

/**
 * Assert that response has success envelope structure
 */
export function expectSuccessResponse(response: Response, statusCode: number = 200) {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.headers).toHaveProperty('x-request-id');
}

/**
 * Assert that response has error envelope structure
 */
export function expectErrorResponse(response: Response, statusCode: number, errorCode?: string) {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('code');
    expect(response.headers).toHaveProperty('x-request-id');

    if (errorCode) {
        expect(response.body.error.code).toBe(errorCode);
    }
}

/**
 * Assert that response has pagination metadata
 */
export function expectPaginatedResponse(response: Response) {
    expectSuccessResponse(response, 200);
    expect(response.body.data).toHaveProperty('items');
    expect(response.body.data).toHaveProperty('pagination');
    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('limit');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(Array.isArray(response.body.data.items)).toBe(true);
    expect(typeof response.body.data.pagination.total).toBe('number');
}

/**
 * Generate mock organization data
 */
export function mockOrganizationData(overrides?: any) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return {
        name: `testorg${timestamp}${random}`,
        display_name: 'Test Organization',
        metadata: {
            industry: 'technology',
            size: 'medium'
        },
        ...overrides
    };
}

/**
 * Generate mock user data
 */
export function mockUserData(overrides?: any) {
    const timestamp = Date.now();
    return {
        email: `test${timestamp}@example.com`,
        name: 'Test User',
        connection: 'Username-Password-Authentication',
        password: 'TestPass123!',
        ...overrides
    };
}

/**
 * Generate mock invitation data
 */
export function mockInvitationData(overrides?: any) {
    return {
        inviter: {
            name: 'Admin User'
        },
        invitee: {
            email: 'invitee@example.com'
        },
        roles: ['member'],
        client_id: 'test_client_id',
        ...overrides
    };
}

/**
 * Generate mock member removal data
 */
export function mockMemberRemovalData(userIds: string[]) {
    return {
        members: userIds
    };
}

/**
 * Generate mock role assignment data
 */
export function mockRoleAssignmentData(roleIds: string[]) {
    return {
        roles: roleIds
    };
}

/**
 * Extract request ID from response headers
 */
export function getRequestId(response: Response): string {
    return response.headers['x-request-id'];
}

/**
 * Create headers with custom request ID
 */
export function withRequestId(requestId: string) {
    return {
        'X-Request-ID': requestId
    };
}
