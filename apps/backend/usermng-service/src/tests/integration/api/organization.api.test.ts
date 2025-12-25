/**
 * Organization API Integration Tests
 * Tests the full HTTP request/response cycle for organization endpoints
 */

import request from 'supertest';
import { createTestApp } from '../setup/testServer';
import { resetMockData, createMockAuth0Client } from '../setup/mockAuth0';
import {
    expectSuccessResponse,
    expectErrorResponse,
    expectPaginatedResponse,
    mockOrganizationData
} from '../setup/testHelpers';
import * as OrganizationModel from '../../../models/organization.model';

// Mock the organization model
jest.mock('../../../models/organization.model');

// Mock the auth middleware to simulate authenticated requests
jest.mock('../../../middlewares/auth', () => ({
    decodeAccessToken: jest.fn((req, res, next) => {
        req.user = {
            sub: 'auth0|test123',
            email: 'test@example.com'
        };
        next();
    })
}));

describe('Organization API Integration Tests', () => {
    let app: any;
    const mockClient = createMockAuth0Client();

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        resetMockData();
        jest.clearAllMocks();

        // Setup model mocks to use our mock Auth0 client methods
        (OrganizationModel.createOrganization as jest.Mock).mockImplementation(async (data: any) => {
            const result = await (mockClient.organizations as any).create(data);
            return result;
        });

        (OrganizationModel.getOrganizations as jest.Mock).mockImplementation(async (params?: any) => {
            const result = await (mockClient.organizations as any).getAll(params);
            const page = params?.page || 0;
            const limit = params?.per_page || 25;
            // Transform to match expected model response format
            return {
                pagination: {
                    page,
                    limit,
                    total: result.total
                },
                items: result.organizations
            };
        }); (OrganizationModel.getOrganizationById as jest.Mock).mockImplementation(async (id: string) => {
            const result = await (mockClient.organizations as any).getByID({ id });
            return result;
        });

        (OrganizationModel.updateOrganization as jest.Mock).mockImplementation(async (id: string, data: any) => {
            const result = await (mockClient.organizations as any).update({ id }, data);
            return result;
        });

        (OrganizationModel.deleteOrganization as jest.Mock).mockImplementation(async (id: string) => {
            await (mockClient.organizations as any).delete({ id });
        });
    });

    describe('POST /orgs - Create Organization', () => {
        it('should create organization and return 201 with success envelope', async () => {
            const orgData = mockOrganizationData();

            const response = await request(app)
                .post('/orgs')
                .send(orgData)
                .expect(201);

            expectSuccessResponse(response, 201);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('name', orgData.name);
            expect(response.body.data).toHaveProperty('display_name', orgData.display_name);
            expect(response.body).toHaveProperty('message', 'Organization created successfully');
        });

        it('should include X-Request-ID in response headers', async () => {
            const orgData = mockOrganizationData();

            const response = await request(app)
                .post('/orgs')
                .send(orgData)
                .expect(201);

            expect(response.headers).toHaveProperty('x-request-id');
            expect(typeof response.headers['x-request-id']).toBe('string');
        });

        it('should use provided X-Request-ID from request header', async () => {
            const orgData = mockOrganizationData();
            const customRequestId = 'custom-request-id-123';

            const response = await request(app)
                .post('/orgs')
                .set('X-Request-ID', customRequestId)
                .send(orgData)
                .expect(201);

            expect(response.headers['x-request-id']).toBe(customRequestId);
        });

        it('should return 400 for validation errors', async () => {
            const invalidData = {
                name: '', // Invalid: empty name
                display_name: 'Test'
            };

            const response = await request(app)
                .post('/orgs')
                .send(invalidData)
                .expect(400);

            expectErrorResponse(response, 400, 'VALIDATION_ERROR');
        });

        it('should handle Auth0 API errors gracefully', async () => {
            // Mock the model to throw Auth0 error
            const error = new Error('Auth0 service unavailable');
            (error as any).name = 'Auth0Error';
            (error as any).statusCode = 503;

            (OrganizationModel.createOrganization as jest.Mock).mockRejectedValueOnce(error);

            const orgData = mockOrganizationData();

            const response = await request(app)
                .post('/orgs')
                .send(orgData)
                .expect(503);

            expectErrorResponse(response, 503);
        });
    });

    describe('GET /orgs - List Organizations', () => {
        it('should return paginated list of organizations', async () => {
            // Create some test organizations via HTTP requests
            await request(app).post('/orgs').send(mockOrganizationData({ name: 'testorg1' }));
            await request(app).post('/orgs').send(mockOrganizationData({ name: 'testorg2' }));
            await request(app).post('/orgs').send(mockOrganizationData({ name: 'testorg3' }));

            const response = await request(app)
                .get('/orgs')
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(3);
            expect(response.body.data.pagination.total).toBe(3);
        }); it('should support pagination with page and per_page params', async () => {
            // Create 5 organizations via HTTP
            for (let i = 0; i < 5; i++) {
                await request(app).post('/orgs').send(
                    mockOrganizationData({ name: `testorg${i}` })
                );
            }

            const response = await request(app)
                .get('/orgs')
                .query({ page: 1, per_page: 2 })
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(2);
            expect(response.body.data.pagination.total).toBe(5);
        }); it('should support search with q parameter', async () => {
            await request(app).post('/orgs').send(
                mockOrganizationData({ name: 'techcompany', display_name: 'Tech Company' })
            );
            await request(app).post('/orgs').send(
                mockOrganizationData({ name: 'financecorp', display_name: 'Finance Corp' })
            );

            const response = await request(app)
                .get('/orgs')
                .query({ q: 'tech' })
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items.length).toBe(1);
            expect(response.body.data.items[0].name).toBe('techcompany');
        });

        it('should return empty array when no organizations exist', async () => {
            const response = await request(app)
                .get('/orgs')
                .expect(200);

            expectPaginatedResponse(response);
            expect(response.body.data.items).toEqual([]);
            expect(response.body.data.pagination.total).toBe(0);
        });
    });

    describe('GET /orgs/:id - Get Organization by ID', () => {
        it('should return organization by ID', async () => {
            const created: any = await (mockClient.organizations as any).create(
                mockOrganizationData()
            );

            const response = await request(app)
                .get(`/orgs/${created.id}`)
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toHaveProperty('id', created.id);
            expect(response.body.data).toHaveProperty('name', created.name);
        });

        it('should return 404 when organization not found', async () => {
            const response = await request(app)
                .get('/orgs/org_nonexistent')
                .expect(404);

            expectErrorResponse(response, 404, 'NOT_FOUND');
            expect(response.body.message).toContain('not found');
        });
    });

    describe('PUT /orgs/:id - Update Organization', () => {
        it('should update organization and return updated data', async () => {
            const created: any = await (mockClient.organizations as any).create(
                mockOrganizationData({ display_name: 'Old Name' })
            );

            const updateData = {
                display_name: 'New Name'
            };

            const response = await request(app)
                .put(`/orgs/${created.id}`)
                .send(updateData)
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toHaveProperty('display_name', 'New Name');
            expect(response.body).toHaveProperty('message', 'Organization updated successfully');
        });

        it('should return 404 when updating non-existent organization', async () => {
            const updateData = {
                display_name: 'New Name'
            };

            const response = await request(app)
                .put('/orgs/org_nonexistent')
                .send(updateData)
                .expect(404);

            expectErrorResponse(response, 404);
        });

        it('should return 400 for validation errors', async () => {
            const created: any = await (mockClient.organizations as any).create(
                mockOrganizationData()
            );

            const invalidData = {
                name: '' // Invalid: empty name
            };

            const response = await request(app)
                .put(`/orgs/${created.id}`)
                .send(invalidData)
                .expect(400);

            expectErrorResponse(response, 400, 'VALIDATION_ERROR');
        });
    });

    describe('DELETE /orgs/:id - Delete Organization', () => {
        it('should delete organization and return 200', async () => {
            const created: any = await (mockClient.organizations as any).create(
                mockOrganizationData()
            );

            const response = await request(app)
                .delete(`/orgs/${created.id}`)
                .expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toBeNull();
        });

        it('should return 404 when deleting non-existent organization', async () => {
            const response = await request(app)
                .delete('/orgs/org_nonexistent')
                .expect(404);

            expectErrorResponse(response, 404);
        });

        it('should include X-Request-ID even for delete responses', async () => {
            const created: any = await (mockClient.organizations as any).create(
                mockOrganizationData()
            );

            const response = await request(app)
                .delete(`/orgs/${created.id}`)
                .expect(200);

            expect(response.headers).toHaveProperty('x-request-id');
        });
    });
});
