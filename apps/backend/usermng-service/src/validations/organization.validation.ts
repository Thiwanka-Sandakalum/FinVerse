/**
 * Organization Validation Rules
 * Contains all validation logic for organization operations
 */

import path from 'path';
import fs from 'fs';
import { OrganizationCreateRequest, OrganizationMetadata } from '../types/organization.types';
import { ValidationError } from '../utils/errors';

/**
 * Load enabled_connections config from file
 */
export function loadEnabledConnectionsConfig(): any[] {
    const configPath = path.resolve(__dirname, '../config/organizationConnections.json');
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
        throw new ValidationError('Organization name is required and must be a string.');
    }

    const normalized = name.replace(/\s+/g, '').toLowerCase();

    if (normalized.length < 1 || normalized.length > 50) {
        throw new ValidationError('Organization name must be between 1 and 50 characters.');
    }

    const nameRegex = /^[a-z0-9][a-z0-9\-_]*$/;
    if (!nameRegex.test(normalized)) {
        throw new ValidationError('Organization name must only contain lowercase letters, numbers, hyphens, and underscores, and must start with a letter or number.');
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
        throw new ValidationError('Organization display_name must be between 1 and 255 characters.');
    }

    return value;
}

/**
 * Validate and filter metadata
 */
export function validateAndFilterMetadata(metadata: any): Record<string, string> {
    if (typeof metadata !== 'object' || metadata === null) {
        throw new ValidationError('Metadata must be an object.');
    }

    const filtered: Record<string, string> = {};

    for (const key of Object.keys(metadata)) {
        const value = metadata[key];
        if (typeof value === 'string' && value.length > 0 && value.length <= 255) {
            filtered[key] = value;
        }
    }

    if (Object.keys(filtered).length > 25) {
        throw new ValidationError('Metadata can have a maximum of 25 properties.');
    }

    return filtered;
}

/**
 * Validate organization creation request
 */
export function validateOrganizationCreate(data: OrganizationCreateRequest): {
    name: string;
    display_name: string;
    metadata?: Record<string, string>;
    enabled_connections?: any[];
} {
    const validatedOrg: any = {};

    validatedOrg.name = validateOrgName(data.name);
    validatedOrg.display_name = validateDisplayName(data.display_name, data.name);

    if (data.metadata) {
        validatedOrg.metadata = validateAndFilterMetadata(data.metadata);
    }

    const enabledConnections = loadEnabledConnectionsConfig();
    if (enabledConnections.length > 0) {
        validatedOrg.enabled_connections = enabledConnections;
    }

    return validatedOrg;
}

/**
 * Validate organization update request
 */
export function validateOrganizationUpdate(data: Partial<OrganizationCreateRequest>): {
    name?: string;
    display_name?: string;
    metadata?: Record<string, string>;
} {
    const allowedUpdates: any = {};

    if (data.name !== undefined) {
        allowedUpdates.name = validateOrgName(data.name);
    }

    if (data.display_name !== undefined) {
        allowedUpdates.display_name = validateDisplayName(data.display_name);
    }

    if (data.metadata !== undefined) {
        allowedUpdates.metadata = validateAndFilterMetadata(data.metadata);
    }

    if (Object.keys(allowedUpdates).length === 0) {
        throw new ValidationError('At least one valid field (name, display_name, or metadata) must be provided for update.');
    }

    return allowedUpdates;
}
