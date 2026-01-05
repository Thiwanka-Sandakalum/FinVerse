/**
 * Mock Auth0 Management API
 * Provides in-memory mock implementation for integration tests
 */

import { ManagementClient } from 'auth0';

// In-memory data stores
export const mockOrganizations = new Map();
export const mockUsers = new Map();
export const mockRoles = new Map();
export const mockMembers = new Map();
export const mockInvitations = new Map();

// Reset function for test isolation
export function resetMockData() {
    mockOrganizations.clear();
    mockUsers.clear();
    mockRoles.clear();
    mockMembers.clear();
    mockInvitations.clear();

    // Seed some default roles
    mockRoles.set('rol_member123', {
        id: 'rol_member123',
        name: 'org_member',
        description: 'Organization Member'
    });
    mockRoles.set('rol_admin123', {
        id: 'rol_admin123',
        name: 'org_admin',
        description: 'Organization Admin'
    });
    mockRoles.set('rol_super123', {
        id: 'rol_super123',
        name: 'super_admin',
        description: 'Super Admin'
    });
}

/**
 * Creates a mock Auth0 Management Client
 */
export function createMockAuth0Client(): Partial<ManagementClient> {
    return {
        organizations: {
            create: jest.fn(async (data: any) => {
                const id = `org_${Date.now()}`;
                const org = {
                    id,
                    name: data.name,
                    display_name: data.display_name,
                    metadata: data.metadata || {},
                    branding: data.branding || {},
                    enabled_connections: data.enabled_connections || []
                };
                mockOrganizations.set(id, org);
                return org;
            }),

            getAll: jest.fn(async (params?: any) => {
                const orgs = Array.from(mockOrganizations.values());
                // Convert string params to numbers if needed
                const page = params?.page ? parseInt(params.page, 10) : 0;
                const per_page = params?.per_page ? parseInt(params.per_page, 10) : 50;
                const { q } = params || {};

                let filtered = orgs;
                if (q) {
                    const query = q.toLowerCase();
                    filtered = orgs.filter((org: any) =>
                        org.name?.toLowerCase().includes(query) ||
                        org.display_name?.toLowerCase().includes(query)
                    );
                }

                const start = page * per_page;
                const items = filtered.slice(start, start + per_page);

                return {
                    organizations: items,
                    start,
                    limit: per_page,
                    total: filtered.length
                };
            }),

            getByID: jest.fn(async ({ id }: { id: string }) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                return org;
            }), update: jest.fn(async ({ id }: { id: string }, data: any) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                const updated = { ...org, ...data };
                mockOrganizations.set(id, updated);
                return updated;
            }),

            delete: jest.fn(async ({ id }: { id: string }) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                mockOrganizations.delete(id);
                return;
            }), getMembers: jest.fn(async ({ id }: { id: string }, params?: any) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.statusCode = 404;
                    throw error;
                }

                const members = mockMembers.get(id) || [];
                const { page = 0, per_page = 50 } = params || {};

                const start = page * per_page;
                const items = members.slice(start, start + per_page);

                return {
                    members: items,
                    start,
                    limit: per_page,
                    total: members.length
                };
            }),

            deleteMembers: jest.fn(async ({ id }: { id: string }, data: any) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.statusCode = 404;
                    throw error;
                }

                const members = mockMembers.get(id) || [];
                const filtered = members.filter((m: any) => !data.members.includes(m.user_id));
                mockMembers.set(id, filtered);
                return;
            }),

            getMemberRoles: jest.fn(async ({ id, userId }: { id: string, userId: string }) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.statusCode = 404;
                    throw error;
                }

                const members = mockMembers.get(id) || [];
                const member = members.find((m: any) => m.user_id === userId);

                return {
                    roles: member?.roles || []
                };
            }),

            addMemberRoles: jest.fn(async ({ id, userId }: { id: string, userId: string }, data: any) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.statusCode = 404;
                    throw error;
                }

                const members = mockMembers.get(id) || [];
                const memberIndex = members.findIndex((m: any) => m.user_id === userId);

                if (memberIndex === -1) {
                    members.push({
                        user_id: userId,
                        roles: data.roles
                    });
                } else {
                    members[memberIndex].roles = [
                        ...(members[memberIndex].roles || []),
                        ...data.roles
                    ];
                }

                mockMembers.set(id, members);
                return;
            }),

            createInvitation: jest.fn(async ({ id }: { id: string }, data: any) => {
                const org = mockOrganizations.get(id);
                if (!org) {
                    const error: any = new Error('Organization not found');
                    error.statusCode = 404;
                    throw error;
                }

                const invitationId = `inv_${Date.now()}`;
                const invitation = {
                    id: invitationId,
                    organization_id: id,
                    inviter: data.inviter,
                    invitee: data.invitee,
                    invitation_url: `https://example.auth0.com/invitation/${invitationId}`,
                    ticket_id: `ticket_${Date.now()}`,
                    created_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    client_id: data.client_id,
                    roles: data.roles || []
                };

                const orgInvitations = mockInvitations.get(id) || [];
                orgInvitations.push(invitation);
                mockInvitations.set(id, orgInvitations);

                return invitation;
            })
        } as any,

        users: {
            getAll: jest.fn(async (params?: any) => {
                const users = Array.from(mockUsers.values());
                // Convert string params to numbers if needed
                const page = params?.page ? parseInt(params.page, 10) : 0;
                const per_page = params?.per_page ? parseInt(params.per_page, 10) : 50;
                const { q, search_engine } = params || {};

                let filtered = users;
                if (q) {
                    const query = q.toLowerCase();
                    filtered = users.filter((user: any) =>
                        user.email?.toLowerCase().includes(query) ||
                        user.name?.toLowerCase().includes(query)
                    );
                }

                const start = page * per_page;
                const items = filtered.slice(start, start + per_page);

                return {
                    users: items,
                    start,
                    limit: per_page,
                    total: filtered.length,
                    length: items.length
                };
            }),

            get: jest.fn(async ({ id }: { id: string }) => {
                const user = mockUsers.get(id);
                if (!user) {
                    const error: any = new Error('User not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                return user;
            }),

            update: jest.fn(async ({ id }: { id: string }, data: any) => {
                const user = mockUsers.get(id);
                if (!user) {
                    const error: any = new Error('User not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                const updated = { ...user, ...data };
                mockUsers.set(id, updated);
                return updated;
            }),

            delete: jest.fn(async ({ id }: { id: string }) => {
                const user = mockUsers.get(id);
                if (!user) {
                    const error: any = new Error('User not found');
                    error.name = 'Auth0Error';
                    error.statusCode = 404;
                    throw error;
                }
                mockUsers.delete(id);
                return;
            })
        } as any,

        roles: {
            getAll: jest.fn(async (params?: any) => {
                const roles = Array.from(mockRoles.values());
                const { name_filter } = params || {};

                let filtered = roles;
                if (name_filter) {
                    filtered = roles.filter((role: any) =>
                        role.name?.includes(name_filter)
                    );
                }

                return {
                    roles: filtered,
                    start: 0,
                    limit: filtered.length,
                    total: filtered.length
                };
            })
        } as any
    };
}

// Initialize mock data
resetMockData();
