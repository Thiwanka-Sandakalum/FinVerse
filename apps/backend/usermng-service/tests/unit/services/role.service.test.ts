/**
 * Role Service Unit Tests
 */

import * as RoleService from '../../../src/services/role.service';
import * as RoleModel from '../../../src/models/role.model';

jest.mock('../../../src/models/role.model');

describe('Role Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRoles', () => {
        it('should get roles successfully', async () => {
            const params = { name_filter: 'member' };
            const mockResponse = {
                items: [
                    { id: 'rol_H3YqNbDe7HWcy2v2', name: 'Member', description: 'Basic member role' },
                    { id: 'rol_lwCVSXrdSoyEIviL', name: 'Organization Admin', description: 'Admin role' },
                    { id: 'rol_qPupmxpQMos4IIPe', name: 'Super Admin', description: 'Super admin role' }
                ],
                total: 3
            };

            (RoleModel.getRoles as jest.Mock).mockResolvedValue(mockResponse);

            const result = await RoleService.getRoles(params);

            expect(RoleModel.getRoles).toHaveBeenCalledWith(params);
            expect(result).toEqual(mockResponse);
        });

        it('should get roles without filters', async () => {
            const params = {};
            const mockResponse = {
                items: [
                    { id: 'rol_H3YqNbDe7HWcy2v2', name: 'Member', description: 'Basic member role' }
                ],
                total: 1
            };

            (RoleModel.getRoles as jest.Mock).mockResolvedValue(mockResponse);

            const result = await RoleService.getRoles(params);

            expect(RoleModel.getRoles).toHaveBeenCalledWith(params);
        });

        it('should handle empty roles list', async () => {
            const params = {};
            const mockResponse = { items: [], total: 0 };

            (RoleModel.getRoles as jest.Mock).mockResolvedValue(mockResponse);

            const result = await RoleService.getRoles(params);

            expect(result).toEqual(mockResponse);
        });

        it('should propagate error if getRoles fails', async () => {
            const params = {};

            (RoleModel.getRoles as jest.Mock).mockRejectedValue(
                new Error('Auth0 API error')
            );

            await expect(RoleService.getRoles(params)).rejects.toThrow('Auth0 API error');
        });
    });
});
