/**
 * User API Integration Tests
 * Tests the full HTTP request/response cycle for user endpoints
 */

import request from 'supertest';
import { createTestApp } from '../setup/testServer';
import { resetMockData, createMockAuth0Client, mockUsers } from '../setup/mockAuth0';
import {
    expectSuccessResponse,
    expectErrorResponse,
    expectPaginatedResponse,
    mockUserData
} from '../setup/testHelpers';
import * as UserModel from '../../../src/models/user.model';

// Mock the User Model
jest.mock('../../../src/models/user.model');

// Mock the Auth0 client
jest.mock('../../../src/utils/auth0', () => ({
    getAuth0Client: jest.fn(() => createMockAuth0Client()),
    getAuth0AccessToken: jest.fn(() => Promise.resolve('mock_token'))
}));

// Mock the auth middleware
jest.mock('../../../src/middlewares/auth', () => ({
    decodeAccessToken: jest.fn((req, res, next) => {
        req.user = {
            sub: 'auth0|test123',
            email: 'test@example.com'
        };
        next();
    })
}));

describe('User API Integration Tests', () => {
    let app: any;
    const mockClient = createMockAuth0Client();

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        resetMockData();
        jest.clearAllMocks();

        // Setup model mocks to use our mock Auth0 client methods
        (UserModel.getUsers as jest.Mock).mockImplementation(async (params?: any) => {
            const result = await (mockClient.users as any).getAll(params);
            // Return in Auth0UserListResponse format (what the real API returns)
            return {
                start: result.start,
                limit: result.limit,
                length: result.length,
                total: result.total,
                users: result.users
            };
        });

        (UserModel.getUserById as jest.Mock).mockImplementation(async (id: string, fields?: string) => {
            const result = await (mockClient.users as any).get({ id });
            return result;
        });

        (UserModel.updateUser as jest.Mock).mockImplementation(async (id: string, data: any) => {
            const result = await (mockClient.users as any).update({ id }, data);
            return result;
        });

        (UserModel.deleteUser as jest.Mock).mockImplementation(async (id: string) => {
            await (mockClient.users as any).delete({ id });
        });

        // Seed some test users
        mockUsers.set('auth0|user1', {
            user_id: 'auth0|user1',
            email: 'user1@example.com',
            name: 'User One',
            created_at: new Date().toISOString()
        });
        mockUsers.set('auth0|user2', {
            user_id: 'auth0|user2',
            email: 'user2@example.com',
            name: 'User Two',
            created_at: new Date().toISOString()
        });
    });

    describe('GET /users - List Users', () => {
        it('should return paginated list of users', async () => {
            const response = await request(app)
                .get('/users')
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(2);
            expect(response.body.data.pagination.total).toBe(2);
        });

        it('should support pagination with page and per_page params', async () => {
            // Add more users
            for (let i = 3; i <= 10; i++) {
                mockUsers.set(`auth0|user${i}`, {
                    user_id: `auth0|user${i}`,
                    email: `user${i}@example.com`,
                    name: `User ${i}`,
                    created_at: new Date().toISOString()
                });
            }

            const response = await request(app)
                .get('/users')
                .query({ page: 1, per_page: 5 })
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(5);
            expect(response.body.data.pagination.total).toBe(10);
        });

        it('should support search with q parameter', async () => {
            const response = await request(app)
                .get('/users')
                .query({ q: 'user1' })
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(1);
            expect(response.body.data.items[0].email).toBe('user1@example.com');
        });

        it('should return empty array when no users match', async () => {
            const response = await request(app)
                .get('/users')
                .query({ q: 'nonexistent' })
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items).toEqual([]);
            expect(response.body.data.pagination.total).toBe(0);
        });
    });

    describe('GET /users/:id - Get User by ID', () => {
        it('should return user by ID', async () => {
            const response = await request(app)
                .get('/users/auth0|user1')
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toHaveProperty('user_id', 'auth0|user1');
            expect(response.body.data).toHaveProperty('email', 'user1@example.com');
        });

        it('should support fields parameter to filter returned fields', async () => {
            const response = await request(app)
                .get('/users/auth0|user1')
                .query({ fields: 'user_id,email' })
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toHaveProperty('user_id');
            expect(response.body.data).toHaveProperty('email');
        });

        it('should return 404 when user not found', async () => {
            const response = await request(app)
                .get('/users/auth0|nonexistent')
                .expect(404);

            expectErrorResponse(response, 404, 'NOT_FOUND');
            expect(response.body.message).toContain('not found');
        });
    });

    describe('PUT /users/:id - Update User', () => {
        it('should update user and return updated data', async () => {
            const updateData = {
                name: 'Updated Name',
                nickname: 'newNick'
            };

            const response = await request(app)
                .put('/users/auth0|user1')
                .send(updateData)
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toHaveProperty('name', 'Updated Name');
            expect(response.body).toHaveProperty('message', 'User updated successfully');
        });

        it('should return 404 when updating non-existent user', async () => {
            const updateData = {
                name: 'Updated Name'
            };

            const response = await request(app)
                .put('/users/auth0|nonexistent')
                .send(updateData)
                .expect(404);

            expectErrorResponse(response, 404);
        });

        it('should return 400 for validation errors', async () => {
            const invalidData = {
                // Invalid: no valid fields
            };

            const response = await request(app)
                .put('/users/auth0|user1')
                .send(invalidData)
                .expect(400);

            expectErrorResponse(response, 400, 'VALIDATION_ERROR');
        });
    });

    describe('DELETE /users/:id - Delete User', () => {
        it('should delete user and return 200', async () => {
            const response = await request(app)
                .delete('/users/auth0|user1')
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.headers).toHaveProperty('x-request-id');
        });

        it('should return 404 when deleting non-existent user', async () => {
            const response = await request(app)
                .delete('/users/auth0|nonexistent')
                .expect(404);

            expectErrorResponse(response, 404, 'NOT_FOUND');
        });

        it('should include X-Request-ID in response headers', async () => {
            const customRequestId = 'delete-user-123';

            const response = await request(app)
                .delete('/users/auth0|user1')
                .set('X-Request-ID', customRequestId)
                .expect(200);

            expect(response.headers['x-request-id']).toBe(customRequestId);
        });
    });
});
