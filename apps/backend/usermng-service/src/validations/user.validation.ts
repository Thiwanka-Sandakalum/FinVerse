/**
 * User Validation Rules
 * Contains all validation logic for user operations
 */

import { AllowedUserUpdates } from '../types/user.types';
import { ValidationError } from '../utils/errors';

/**
 * Validate user update request
 */
export function validateUserUpdate(updates: any): AllowedUserUpdates {
    if (!updates || typeof updates !== 'object') {
        throw new ValidationError('Updates object is required');
    }

    const { name, metadata, picture } = updates;
    const allowedUpdates: AllowedUserUpdates = {};

    if (name !== undefined) allowedUpdates.name = name;
    if (metadata !== undefined) allowedUpdates.user_metadata = metadata;
    if (picture !== undefined) allowedUpdates.picture = picture;

    if (Object.keys(allowedUpdates).length === 0) {
        throw new ValidationError('At least one valid field (name, user_metadata, or picture) must be provided for update');
    }

    return allowedUpdates;
}
