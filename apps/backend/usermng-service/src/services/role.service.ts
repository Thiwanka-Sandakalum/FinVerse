/**
 * Role Service
 * Contains business logic for role operations
 */

import * as RoleModel from '../models/role.model';
import { RoleListResponse } from '../types/role.types';

/**
 * Get roles
 */
export async function getRoles(params: {
    per_page?: number;
    page?: number;
    include_totals?: boolean;
    name_filter?: string;
} = {}): Promise<RoleListResponse> {
    return await RoleModel.getRoles(params);
}
