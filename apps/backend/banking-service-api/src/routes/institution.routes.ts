import { Router } from 'express';
import { InstitutionController } from '../controllers/institution.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const institutionController = new InstitutionController();

/**
 * @route   GET /api/institutions
 * @desc    Get all institutions
 * @access  Public
 */
router.get('/', institutionController.getAll);

/**
 * @route   GET /api/institutions/:id
 * @desc    Get institution by ID
 * @access  Public
 */
router.get('/:id', institutionController.getById);

/**
 * @route   POST /api/institutions
 * @desc    Create a new institution
 * @access  Admin
 */
router.post('/', authenticateJwt, institutionController.create);

/**
 * @route   PUT /api/institutions/:id
 * @desc    Update an institution
 * @access  Admin
 */
router.put('/:id', authenticateJwt, institutionController.update);

/**
 * @route   DELETE /api/institutions/:id
 * @desc    Delete an institution
 * @access  Admin
 */
router.delete('/:id', authenticateJwt, institutionController.delete);

/**
 * @route   PATCH /api/institutions/:id/status
 * @desc    Activate or deactivate an institution
 * @access  Admin
 */
router.patch('/:id/status', authenticateJwt, institutionController.setActiveStatus);

export default router;
