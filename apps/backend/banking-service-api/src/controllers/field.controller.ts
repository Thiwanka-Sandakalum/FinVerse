import { Request, Response } from 'express';
import { FieldService } from '../services/field.service';
import { handleError } from '../utils/error-handler';

const fieldService = new FieldService();

export class FieldController {
    /**
     * Get all fields
     */
    async getAllFields(req: Request, res: Response) {
        try {
            const fields = await fieldService.getAllFields();
            res.json(fields);
        } catch (error) {
            handleError(error, res);
        }
    }

    /**
     * Get fields by category ID
     */
    async getFieldsByCategoryId(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;
            const fields = await fieldService.getFieldsByCategoryId(categoryId);
            res.json(fields);
        } catch (error) {
            handleError(error, res);
        }
    }

    /**
     * Get field by ID
     */
    async getFieldById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const field = await fieldService.getFieldById(id);
            res.json(field);
        } catch (error) {
            handleError(error, res);
        }
    }

    /**
     * Create a new field
     */
    async createField(req: Request, res: Response) {
        try {
            const field = await fieldService.createField(req.body);
            res.status(201).json(field);
        } catch (error) {
            handleError(error, res);
        }
    }

    /**
     * Update a field
     */
    async updateField(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const field = await fieldService.updateField(id, req.body);
            res.json(field);
        } catch (error) {
            handleError(error, res);
        }
    }

    /**
     * Delete a field
     */
    async deleteField(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const field = await fieldService.deleteField(id);
            res.json(field);
        } catch (error) {
            handleError(error, res);
        }
    }
}
