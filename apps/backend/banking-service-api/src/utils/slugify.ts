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
