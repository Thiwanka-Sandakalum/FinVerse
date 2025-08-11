import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';

const router = Router();
const tagController = new TagController();

/**
 * @route GET /products/tags
 * @desc Get all product tags
 * @access Public
 */
router.get('/', tagController.getAllTags);

/**
 * @route POST /products/:id/tags
 * @desc Add a tag to a product
 * @access Private (Institution Admin)
 */
router.post('/:id/tags',
    tagController.addTagToProduct
);

/**
 * @route DELETE /products/:id/tags/:tagId
 * @desc Remove a tag from a product
 * @access Private (Institution Admin)
 */
router.delete('/:id/tags/:tagId',
    tagController.removeTagFromProduct
);


export default router;