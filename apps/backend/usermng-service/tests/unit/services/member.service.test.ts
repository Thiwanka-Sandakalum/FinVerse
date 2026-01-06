/**
 * Member Service Unit Tests  
 */

import * as MemberService from '../../../src/services/member.service';
import * as MemberModel from '../../../src/models/member.model';

jest.mock('../../../src/models/member.model');

describe('Member Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrganizationMembers', () => {
        it('should get organization members successfully', async () => {
            const orgId = 'org_123456789';
            const params = { page: 0, per_page: 25 };
            const mockResponse = {
                items: [
                    { user_id: 'auth0|1', email: 'member1@example.com', name: 'Member 1' },
                    { user_id: 'auth0|2', email: 'member2@example.com', name: 'Member 2' }
                ],
                total: 2
            };

            (MemberModel.getOrganizationMembers as jest.Mock).mockResolvedValue(mockResponse);

            const result = await MemberService.getOrganizationMembers(orgId, params);

            expect(MemberModel.getOrganizationMembers).toHaveBeenCalledWith(orgId, params);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('deleteOrganizationMembers', () => {
        it('should delete members successfully', async () => {
            const orgId = 'org_123456789';
            const members = ['auth0|123', 'auth0|456'];

            (MemberModel.deleteOrganizationMembers as jest.Mock).mockResolvedValue(undefined);

            await MemberService.deleteOrganizationMembers(orgId, members);

            expect(MemberModel.deleteOrganizationMembers).toHaveBeenCalledWith(orgId, members);
        });
    });

    describe('getOrganizationMemberRoles', () => {
        it('should get member roles successfully', async () => {
            const orgId = 'org_123456789';
            const userId = 'auth0|123456789';
            const params = {};
            const mockResponse = {
                items: [
                    { id: 'rol_H3YqNbDe7HWcy2v2', name: 'Member' }
                ],
                total: 1
            };

            (MemberModel.getOrganizationMemberRoles as jest.Mock).mockResolvedValue(mockResponse);

            const result = await MemberService.getOrganizationMemberRoles(orgId, userId, params);

            expect(MemberModel.getOrganizationMemberRoles).toHaveBeenCalledWith(orgId, userId, params);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('assignOrganizationMemberRoles', () => {
        it('should assign roles to member successfully', async () => {
            const orgId = 'org_123456789';
            const userId = 'auth0|123456789';
            const roles = ['rol_H3YqNbDe7HWcy2v2'];

            (MemberModel.assignOrganizationMemberRoles as jest.Mock).mockResolvedValue(undefined);

            await MemberService.assignOrganizationMemberRoles(orgId, userId, roles);

            expect(MemberModel.assignOrganizationMemberRoles).toHaveBeenCalledWith(orgId, userId, roles);
        });
    });
});
