/**
 * User Service Unit Tests
 */

import * as UserService from '../../../services/user.service';
import * as UserModel from '../../../models/user.model';
import * as UserValidation from '../../../validations/user.validation';
import { Auth0User } from '../../../types/user.types';

jest.mock('../../../models/user.model');
jest.mock('../../../validations/user.validation');

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const userId = 'auth0|123456789';
            (UserModel.deleteUser as jest.Mock).mockResolvedValue(undefined);

            await UserService.deleteUser(userId);

            expect(UserModel.deleteUser).toHaveBeenCalledWith(userId);
        });

        it('should propagate error if deletion fails', async () => {
            const userId = 'auth0|123456789';
            (UserModel.deleteUser as jest.Mock).mockRejectedValue(
                new Error('User not found')
            );

            await expect(UserService.deleteUser(userId)).rejects.toThrow('User not found');
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const userId = 'auth0|123456789';
            const updates = {
                name: 'John Updated',
                user_metadata: { firstName: 'John', lastName: 'Updated' }
            };

            const validatedUpdates = {
                name: 'John Updated',
                user_metadata: { firstName: 'John', lastName: 'Updated' }
            };

            const mockUpdatedUser: Auth0User = {
                user_id: userId,
                email: 'john@example.com',
                name: 'John Updated',
                user_metadata: { firstName: 'John', lastName: 'Updated' }
            };

            (UserValidation.validateUserUpdate as jest.Mock).mockReturnValue(validatedUpdates);
            (UserModel.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const result = await UserService.updateUser(userId, updates);

            expect(UserValidation.validateUserUpdate).toHaveBeenCalledWith(updates);
            expect(UserModel.updateUser).toHaveBeenCalledWith(userId, validatedUpdates);
            expect(result.name).toBe('John Updated');
        });

        it('should throw error if validation fails', async () => {
            const userId = 'auth0|123456789';
            const invalidUpdates = {
                user_id: 'new-id',  // Not allowed
                app_metadata: { role: 'admin' }  // Not allowed
            };

            (UserValidation.validateUserUpdate as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid update fields');
            });

            await expect(UserService.updateUser(userId, invalidUpdates)).rejects.toThrow(
                'Invalid update fields'
            );
            expect(UserModel.updateUser).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should get user by ID successfully', async () => {
            const userId = 'auth0|123456789';
            const mockUser: Auth0User = {
                user_id: userId,
                email: 'test@example.com',
                name: 'Test User',
                app_metadata: { org_id: 'org_123' }
            };

            (UserModel.getUserById as jest.Mock).mockResolvedValue(mockUser);

            const result = await UserService.getUserById(userId);

            expect(UserModel.getUserById).toHaveBeenCalledWith(userId, {});
            expect(result).toEqual(mockUser);
        });

        it('should get user with specific fields', async () => {
            const userId = 'auth0|123456789';
            const params = { fields: 'user_id,email,name', include_fields: true };
            const mockUser: Auth0User = {
                user_id: userId,
                email: 'test@example.com',
                name: 'Test User'
            };

            (UserModel.getUserById as jest.Mock).mockResolvedValue(mockUser);

            const result = await UserService.getUserById(userId, params);

            expect(UserModel.getUserById).toHaveBeenCalledWith(userId, params);
            expect(result).toEqual(mockUser);
        });

        it('should propagate error if user not found', async () => {
            const userId = 'auth0|nonexistent';
            (UserModel.getUserById as jest.Mock).mockRejectedValue(
                new Error('User not found')
            );

            await expect(UserService.getUserById(userId)).rejects.toThrow('User not found');
        });
    });

    describe('getUsers', () => {
        it('should get users list successfully', async () => {
            const params = { page: 0, per_page: 25 };
            const mockResponse = {
                users: [
                    { user_id: 'auth0|1', email: 'user1@example.com', name: 'User 1' },
                    { user_id: 'auth0|2', email: 'user2@example.com', name: 'User 2' }
                ],
                start: 0,
                limit: 25,
                total: 2
            };

            (UserModel.getUsers as jest.Mock).mockResolvedValue(mockResponse);

            const result = await UserService.getUsers(params);

            expect(UserModel.getUsers).toHaveBeenCalledWith(params);
            expect(result).toBeDefined();
        });

        it('should handle empty user list', async () => {
            const params = { page: 0, per_page: 25 };
            const mockResponse = {
                users: [],
                start: 0,
                limit: 25,
                total: 0
            };

            (UserModel.getUsers as jest.Mock).mockResolvedValue(mockResponse);

            const result = await UserService.getUsers(params);

            expect(result).toBeDefined();
        });
    });
});
