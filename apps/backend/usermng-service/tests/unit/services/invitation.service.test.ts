/**
 * Invitation Service Unit Tests
 */

import * as InvitationService from '../../../src/services/invitation.service';
import * as InvitationModel from '../../../src/models/invitation.model';
import * as InvitationValidation from '../../../src/validations/invitation.validation';
import { OrganizationInvitation, CreateInvitationPayload } from '../../../src/types/invitation.types';

jest.mock('../../../src/models/invitation.model');
jest.mock('../../../src/validations/invitation.validation');

describe('Invitation Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrganizationInvitation', () => {
        it('should create invitation successfully with role name', async () => {
            const orgId = 'org_123456789';
            const payload: CreateInvitationPayload = {
                inviter: { name: 'Admin User' },
                invitee: { email: 'newuser@example.com' },
                roles: ['member']
            };

            const validatedPayload = {
                ...payload,
                roles: ['rol_H3YqNbDe7HWcy2v2'],  // Converted to role ID
                client_id: 'test-client-id'
            };

            const mockInvitation: OrganizationInvitation = {
                id: 'inv_123456789',
                organization_id: orgId,
                inviter: { name: 'Admin User' },
                invitee: { email: 'newuser@example.com' },
                roles: ['rol_H3YqNbDe7HWcy2v2'],
                ticket_id: 'ticket_123',
                invitation_url: 'https://test-tenant.auth0.com/invitation/123',
                client_id: 'test-client-id',
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            (InvitationValidation.validateInvitationCreate as jest.Mock).mockReturnValue(validatedPayload);
            (InvitationModel.createOrganizationInvitation as jest.Mock).mockResolvedValue(mockInvitation);

            const result = await InvitationService.createOrganizationInvitation(orgId, payload);

            expect(InvitationValidation.validateInvitationCreate).toHaveBeenCalledWith(payload);
            expect(InvitationModel.createOrganizationInvitation).toHaveBeenCalledWith(orgId, validatedPayload);
            expect(result.id).toBe('inv_123456789');
            expect(result.invitee.email).toBe('newuser@example.com');
        });

        it('should create invitation with org_admin role', async () => {
            const orgId = 'org_123456789';
            const payload: CreateInvitationPayload = {
                inviter: { name: 'Super Admin' },
                invitee: { email: 'orgadmin@example.com' },
                roles: ['org_admin']
            };

            const validatedPayload = {
                ...payload,
                roles: ['rol_lwCVSXrdSoyEIviL'],  // org_admin role ID
                client_id: 'test-client-id'
            };

            const mockInvitation: OrganizationInvitation = {
                id: 'inv_987654321',
                organization_id: orgId,
                inviter: { name: 'Super Admin' },
                invitee: { email: 'orgadmin@example.com' },
                roles: ['rol_lwCVSXrdSoyEIviL'],
                ticket_id: 'ticket_456',
                invitation_url: 'https://test-tenant.auth0.com/invitation/456',
                client_id: 'test-client-id',
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            (InvitationValidation.validateInvitationCreate as jest.Mock).mockReturnValue(validatedPayload);
            (InvitationModel.createOrganizationInvitation as jest.Mock).mockResolvedValue(mockInvitation);

            const result = await InvitationService.createOrganizationInvitation(orgId, payload);

            expect(result.roles).toContain('rol_lwCVSXrdSoyEIviL');
        });

        it('should throw error if validation fails', async () => {
            const orgId = 'org_123456789';
            const invalidPayload: CreateInvitationPayload = {
                inviter: { name: '' },  // Empty inviter name
                invitee: { email: '' },  // Empty email
                roles: []
            };

            (InvitationValidation.validateInvitationCreate as jest.Mock).mockImplementation(() => {
                throw new Error('Invitee email is required');
            });

            await expect(
                InvitationService.createOrganizationInvitation(orgId, invalidPayload)
            ).rejects.toThrow('Invitee email is required');
            expect(InvitationModel.createOrganizationInvitation).not.toHaveBeenCalled();
        });

        it('should throw error for invalid role name', async () => {
            const orgId = 'org_123456789';
            const payload: CreateInvitationPayload = {
                inviter: { name: 'Admin' },
                invitee: { email: 'user@example.com' },
                roles: ['invalid_role']
            };

            (InvitationValidation.validateInvitationCreate as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid role name: invalid_role');
            });

            await expect(
                InvitationService.createOrganizationInvitation(orgId, payload)
            ).rejects.toThrow('Invalid role name: invalid_role');
        });
    });

    describe('getOrganizationInvitations', () => {
        it('should get invitations list successfully', async () => {
            const orgId = 'org_123456789';
            const params = { page: 0, per_page: 25 };
            const mockResponse = {
                invitations: [
                    {
                        id: 'inv_1',
                        organization_id: orgId,
                        invitee: { email: 'user1@example.com' },
                        roles: ['rol_H3YqNbDe7HWcy2v2']
                    },
                    {
                        id: 'inv_2',
                        organization_id: orgId,
                        invitee: { email: 'user2@example.com' },
                        roles: ['rol_lwCVSXrdSoyEIviL']
                    }
                ]
            };

            (InvitationModel.getOrganizationInvitations as jest.Mock).mockResolvedValue(mockResponse);

            const result = await InvitationService.getOrganizationInvitations(orgId, params);

            expect(InvitationModel.getOrganizationInvitations).toHaveBeenCalledWith(orgId, params);
            expect(result).toEqual(mockResponse);
        });

        it('should handle empty invitations list', async () => {
            const orgId = 'org_123456789';
            const params = {};
            const mockResponse = { invitations: [] };

            (InvitationModel.getOrganizationInvitations as jest.Mock).mockResolvedValue(mockResponse);

            const result = await InvitationService.getOrganizationInvitations(orgId, params);

            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteOrganizationInvitation', () => {
        it('should delete invitation successfully', async () => {
            const orgId = 'org_123456789';
            const invitationId = 'inv_123456789';

            (InvitationModel.deleteOrganizationInvitation as jest.Mock).mockResolvedValue(undefined);

            await InvitationService.deleteOrganizationInvitation(orgId, invitationId);

            expect(InvitationModel.deleteOrganizationInvitation).toHaveBeenCalledWith(orgId, invitationId);
        });

        it('should propagate error if deletion fails', async () => {
            const orgId = 'org_123456789';
            const invitationId = 'inv_nonexistent';

            (InvitationModel.deleteOrganizationInvitation as jest.Mock).mockRejectedValue(
                new Error('Invitation not found')
            );

            await expect(
                InvitationService.deleteOrganizationInvitation(orgId, invitationId)
            ).rejects.toThrow('Invitation not found');
        });
    });
});
