import { Request, Response } from 'express';
import { InstitutionTypeService } from '../services/institution-type.service';
import { InstitutionTypeCreateDto, InstitutionTypeUpdateDto } from '../types/api.types';

export class InstitutionTypeController {
    private institutionTypeService: InstitutionTypeService;

    constructor() {
        this.institutionTypeService = new InstitutionTypeService();
    }

    /**
     * Get all institution types
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const institutionTypes = await this.institutionTypeService.getAllInstitutionTypes();

            res.status(200).json({
                data: institutionTypes
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch institution types'
            });
        }
    };

    /**
     * Get institution type by ID
     */
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const institutionType = await this.institutionTypeService.getInstitutionTypeById(id);

            res.status(200).json(institutionType);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to fetch institution type'
            });
        }
    };

    /**
     * Create a new institution type
     */
    create = async (req: Request, res: Response) => {
        try {
            const data: InstitutionTypeCreateDto = req.body;
            const newInstitutionType = await this.institutionTypeService.createInstitutionType(data);

            res.status(201).json(newInstitutionType);
        } catch (error) {
            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to create institution type'
            });
        }
    };

    /**
     * Update an institution type
     */
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data: InstitutionTypeUpdateDto = req.body;
            const updatedInstitutionType = await this.institutionTypeService.updateInstitutionType(id, data);

            res.status(200).json(updatedInstitutionType);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            res.status(400).json({
                code: 400,
                message: error instanceof Error ? error.message : 'Failed to update institution type'
            });
        }
    };

    /**
     * Delete an institution type
     */
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.institutionTypeService.deleteInstitutionType(id);

            res.status(200).json({
                message: `Institution type with ID ${id} has been deleted`
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({
                    code: 404,
                    message: error.message
                });
            }

            if (error instanceof Error && error.message.includes('being used')) {
                return res.status(400).json({
                    code: 400,
                    message: error.message
                });
            }

            res.status(500).json({
                code: 500,
                message: error instanceof Error ? error.message : 'Failed to delete institution type'
            });
        }
    };
}
