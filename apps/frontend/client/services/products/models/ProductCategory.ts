/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldDefinition } from './FieldDefinition';
export type ProductCategory = {
    id?: string;
    parentId?: string;
    name: string;
    description?: string;
    level?: number;
    parent?: ProductCategory;
    children?: Array<ProductCategory>;
    fieldDefinitions?: Array<FieldDefinition>;
};

