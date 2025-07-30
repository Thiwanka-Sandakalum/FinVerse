import { Router } from 'express';
import { InstitutionTypeController } from '../controllers/institution-type.controller';


const router = Router();
const institutionTypeController = new InstitutionTypeController();

/**
 * @route   GET /api/institution-types
 * @desc    Get all institution types
 * @access  Public
 */
router.get('/', institutionTypeController.getAll);

/**
 * @route   GET /api/institution-types/:id
 * @desc    Get institution type by ID
 * @access  Public
 */
router.get('/:id', institutionTypeController.getById);

/**
 * @route   POST /api/institution-types
 * @desc    Create a new institution type
 * @access  Admin
 */
router.post('/', institutionTypeController.create);

/**
 * @route   PUT /api/institution-types/:id
 * @desc    Update an institution type
 * @access  Admin
 */
router.put('/:id', institutionTypeController.update);

/**
 * @route   DELETE /api/institution-types/:id
 * @desc    Delete an institution type
 * @access  Admin
 */
router.delete('/:id', institutionTypeController.delete);

export default router;
