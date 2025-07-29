import { Request, Response } from 'express';
import { InstitutionService } from '../services/institution.service';
import { InstitutionCreateDto, InstitutionUpdateDto, InstitutionActivateDto, PaginatedRequest } from '../types/api.types';

export class InstitutionController {
    private institutionService: InstitutionService;

    constructor() {
        this.institutionService = new InstitutionService();
    }

    /**
     * Get all institutions with pagination and filters
     */
    getAll = async (req: PaginatedRequest, res: Response) => {
        try {
            const { typeId, countryCode, isActive } = req.query;
            const { limit, offset } = req.pagination || { limit: 20, offset: 0 };

            const filters = {
                typeId: typeId as string | undefined,
                countryCode: countryCode as string | undefined,
                isActive: isActive !== undefined ? isActive === 'true' : undefined,
                limit,
                offset
            };

            const result = await this.institutionService.getAllInstitutions(filters);

            res.status(200).json({
                data: result.institutions,
                meta: result.meta
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch institutions'
            });
        }
    };

    /**
     * Get institution by ID
     */
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const institution = await this.institutionService.getInstitutionById(id);

            if (!institution) {
                return res.status(404).json({
                    code: 404,
                    message: `Institution with ID ${id} not found`
                });
            }

            res.status(200).json(institution);
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch institution'
            });
        }
    };

    /**
     * Create a new institution
     */
    create = async (req: Request, res: Response) => {
        try {
            const data: InstitutionCreateDto = req.body;
            const newInstitution = await this.institutionService.createInstitution(data);

            res.status(201).json(newInstitution);
        } catch (error) {
            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to create institution'
            });
        }
    };

    /**
     * Update an institution
     */
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data: InstitutionUpdateDto = req.body;
            const updatedInstitution = await this.institutionService.updateInstitution(id, data);

            res.status(200).json(updatedInstitution);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to update institution'
            });
        }
    };

    /**
     * Delete an institution
     */
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.institutionService.deleteInstitution(id);

            res.status(200).json({
                message: `Institution with ID ${id} has been deleted`
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to delete institution'
            });
        }
    };

    /**
     * Activate or deactivate an institution
     */
    setActiveStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { isActive }: InstitutionActivateDto = req.body;

            const institution = await this.institutionService.setInstitutionActiveStatus(id, isActive);

            res.status(200).json({
                message: `Institution with ID ${id} has been ${isActive ? 'activated' : 'deactivated'}`,
                data: institution
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to update institution status'
            });
        }
    };
}
