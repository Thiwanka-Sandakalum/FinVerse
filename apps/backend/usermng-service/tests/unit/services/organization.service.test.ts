/**
 * Organization Service Unit Tests
 */

import * as OrganizationService from '../../../src/services/organization.service';
import * as OrganizationModel from '../../../src/models/organization.model';
import * as OrganizationValidation from '../../../src/validations/organization.validation';
import { Organization, OrganizationCreateRequest, IndustryType } from '../../../src/types/organization.types';

// Mock the model and validation layers
jest.mock('../../../src/models/organization.model');
jest.mock('../../../src/validations/organization.validation');

describe('Organization Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrganization', () => {
        it('should create organization successfully', async () => {
            const mockInput: OrganizationCreateRequest = {
                name: 'Test Company',
                display_name: 'Test Company Inc',
                metadata: { industryType: IndustryType.Fintech, country: 'USA' }
            };

            const mockValidatedData = {
                name: 'testcompany',
                display_name: 'Test Company Inc',
                metadata: { industryType: IndustryType.Fintech, country: 'USA' },
                enabled_connections: []
            };

            const mockOrganizationResponse: Organization = {
                id: 'org_123456789',
                name: 'testcompany',
                display_name: 'Test Company Inc',
                metadata: { industryType: IndustryType.Fintech, country: 'USA' }
            };

            (OrganizationValidation.validateOrganizationCreate as jest.Mock).mockReturnValue(mockValidatedData);
            (OrganizationModel.createOrganization as jest.Mock).mockResolvedValue(mockOrganizationResponse);

            const result = await OrganizationService.createOrganization(mockInput);

            expect(OrganizationValidation.validateOrganizationCreate).toHaveBeenCalledWith(mockInput);
            expect(OrganizationModel.createOrganization).toHaveBeenCalledWith(mockValidatedData);
            expect(result.id).toBe('org_123456789');
            expect(result.name).toBe('testcompany');
        });

        it('should throw error if validation fails', async () => {
            const mockInput: OrganizationCreateRequest = {
                name: '',
                display_name: ''
            };

            (OrganizationValidation.validateOrganizationCreate as jest.Mock).mockImplementation(() => {
                throw new Error('Organization name is required and must be a string.');
            });

            await expect(OrganizationService.createOrganization(mockInput)).rejects.toThrow(
                'Organization name is required and must be a string.'
            );
            expect(OrganizationModel.createOrganization).not.toHaveBeenCalled();
        });
    });

    describe('updateOrganization', () => {
        it('should update organization successfully', async () => {
            const orgId = 'org_123456789';
            const updates: Partial<Organization> = {
                display_name: 'Updated Company Name',
                metadata: { industryType: IndustryType.Bank }
            };

            const mockValidatedUpdates = {
                display_name: 'Updated Company Name',
                metadata: { industryType: IndustryType.Bank }
            };

            const mockUpdatedOrg: Organization = {
                id: orgId,
                name: 'testcompany',
                display_name: 'Updated Company Name',
                metadata: { industryType: IndustryType.Bank }
            };

            (OrganizationValidation.validateOrganizationUpdate as jest.Mock).mockReturnValue(mockValidatedUpdates);
            (OrganizationModel.updateOrganization as jest.Mock).mockResolvedValue(mockUpdatedOrg);

            const result = await OrganizationService.updateOrganization(orgId, updates);

            expect(result.display_name).toBe('Updated Company Name');
        });

        it('should throw error if organization ID is missing', async () => {
            await expect(OrganizationService.updateOrganization('', {})).rejects.toThrow(
                'Organization ID is required'
            );
        });
    });

    describe('deleteOrganization', () => {
        it('should delete organization successfully', async () => {
            const orgId = 'org_123456789';
            (OrganizationModel.deleteOrganization as jest.Mock).mockResolvedValue(undefined);

            await OrganizationService.deleteOrganization(orgId);

            expect(OrganizationModel.deleteOrganization).toHaveBeenCalledWith(orgId);
        });
    });

    describe('getOrganizationById', () => {
        it('should get organization by ID successfully', async () => {
            const orgId = 'org_123456789';
            const mockOrg: Organization = {
                id: orgId,
                name: 'testcompany',
                display_name: 'Test Company',
                metadata: { industryType: IndustryType.Fintech }
            };

            (OrganizationModel.getOrganizationById as jest.Mock).mockResolvedValue(mockOrg);

            const result = await OrganizationService.getOrganizationById(orgId);

            expect(result).toEqual(mockOrg);
        });
    });
});
