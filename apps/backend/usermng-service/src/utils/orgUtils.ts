import path from 'path';
import fs from 'fs';

/**
 * Load enabled_connections config from file
 */
export function loadEnabledConnectionsConfig(): any[] {
    const configPath = path.resolve(__dirname, '../../config/organizationConnections.json');
    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        return [];
    }
}

/**
 * Validate and normalize organization name
 */
export function validateOrgName(name: string): string {
    if (!name || typeof name !== 'string') {
        throw new Error('Organization name is required and must be a string.');
    }
    const normalized = name.replace(/\s+/g, '').toLowerCase();
    if (normalized.length < 1 || normalized.length > 50) {
        throw new Error('Organization name must be between 1 and 50 characters.');
    }
    const nameRegex = /^[a-z0-9][a-z0-9\-_]*$/;
    if (!nameRegex.test(normalized)) {
        throw new Error('Organization name must only contain lowercase letters, numbers, hyphens, and underscores, and must start with a letter or number.');
    }
    return normalized;
}

/**
 * Validate and normalize display_name
 */
export function validateDisplayName(displayName: string | undefined, fallback?: string): string {
    let value = displayName;
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
        value = fallback || '';
    }
    if (value.length < 1 || value.length > 255) {
        throw new Error('Organization display_name must be between 1 and 255 characters.');
    }
    return value;
}

/**
 * Validate and filter metadata
 */
export function validateAndFilterMetadata(metadata: any): Record<string, string> {
    if (typeof metadata !== 'object' || metadata === null) {
        throw new Error('Metadata must be an object.');
    }
    const filtered: Record<string, string> = {};
    for (const key of Object.keys(metadata)) {
        const value = metadata[key];
        if (typeof value === 'string' && value.length > 0 && value.length <= 255) {
            filtered[key] = value;
        }
    }
    if (Object.keys(filtered).length > 25) {
        throw new Error('Metadata can have a maximum of 25 properties.');
    }
    return filtered;
}
