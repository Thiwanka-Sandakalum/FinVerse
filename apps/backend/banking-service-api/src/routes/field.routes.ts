import { Router } from 'express';
import { FieldController } from '../controllers/field.controller';

const router = Router();
const fieldController = new FieldController();

// Get all fields
router.get('/', fieldController.getAllFields.bind(fieldController));

// Get fields by category ID
router.get('/category/:categoryId', fieldController.getFieldsByCategoryId.bind(fieldController));

// Get field by ID
router.get('/:id', fieldController.getFieldById.bind(fieldController));

// Create new field
router.post('/', fieldController.createField.bind(fieldController));

// Update field
router.put('/:id', fieldController.updateField.bind(fieldController));

// Delete field
router.delete('/:id', fieldController.deleteField.bind(fieldController));

export default router;
