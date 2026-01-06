/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FieldDefinition = {
    id?: string;
    categoryId: string;
    name: string;
    dataType: FieldDefinition.dataType;
    isRequired?: boolean;
    validation?: Record<string, any>;
};
export namespace FieldDefinition {
    export enum dataType {
        STRING = 'string',
        NUMBER = 'number',
        DATE = 'date',
        BOOLEAN = 'boolean',
        JSON = 'json',
    }
}

