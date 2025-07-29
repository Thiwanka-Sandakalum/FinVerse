import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';
import { asyncHandler } from '../middlewares/error.middleware';

export class TagController {
    private tagService: TagService;

    constructor() {
        this.tagService = new TagService();
    }

    /**
     * Get all product tags
     */
    getAllTags = asyncHandler(async (req: Request, res: Response) => {
        const tags = await this.tagService.getAllTags();
        res.status(200).json(tags);
    });

    /**
     * Add a tag to a product
     */
    addTagToProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { tagId } = req.body;
        const tag = await this.tagService.addTagToProduct(id, tagId);
        res.status(200).json(tag);
    });

    /**
     * Remove a tag from a product
     */
    removeTagFromProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id, tagId } = req.params;
        await this.tagService.removeTagFromProduct(id, tagId);
        res.status(200).json({ message: 'Tag removed from product' });
    });
}
