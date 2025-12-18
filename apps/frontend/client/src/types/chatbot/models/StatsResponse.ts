/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StatsResponse = {
    status?: StatsResponse.status;
    stats?: {
        total_queries?: number;
        query_types?: Record<string, number>;
        avg_response_time?: number;
    };
};
export namespace StatsResponse {
    export enum status {
        SUCCESS = 'success',
    }
}

