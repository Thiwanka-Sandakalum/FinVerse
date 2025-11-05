// Generate a meaningful product ID based on category and name
import { randomUUID } from 'node:crypto';
import prisma from '../config/database';

/**
 * Generates a meaningful product ID (e.g., 'ln-some-loan-abc12345')
 * @param data Product data (should include categoryId and/or name)
 * @returns Promise<string> generated product ID
 */
export async function generateProductId(data: { categoryId?: string; name?: string; id?: string }) {
    if (data.id) return data.id;
    let prefix = 'pr';
    if (data.categoryId) {
        const category = await prisma.productCategory.findUnique({ where: { id: data.categoryId } });
        if (category && category.name) {
            prefix = category.name.slice(0, 2).toLowerCase();
        }
    }
    if (!data.categoryId && data.name) {
        prefix = data.name.slice(0, 2).toLowerCase();
    }
    const nameSlug = data.name ? slugify(data.name).slice(0, 10) : 'product';
    const unique = randomUUID().split('-')[0];
    return `${prefix}-${nameSlug}-${unique}`;
}
/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert
 * @returns A URL-friendly slug
 */
export default function slugify(text: string): string {
    return text
        .toString()                   // Convert to string
        .toLowerCase()                // Convert to lowercase
        .normalize('NFD')             // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/\s+/g, '-')         // Replace spaces with dashes
        .replace(/[^\w-]+/g, '')      // Remove non-word chars except dashes
        .replace(/--+/g, '-')         // Replace multiple dashes with single dash
        .replace(/^-+/, '')           // Trim dashes from start
        .replace(/-+$/, '');          // Trim dashes from end
}
