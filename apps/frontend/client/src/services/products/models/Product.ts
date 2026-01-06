/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldDefinition } from './FieldDefinition';
export type Product = {
    id?: string;
    institutionId: string;
    categoryId: string;
    name: string;
    /**
     * Dynamic fields based on product category
     */
    details: Record<string, any>;
    isFeatured?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
    fieldDefinitions?: Array<FieldDefinition>;
    Product?: Array<Product>;
};

