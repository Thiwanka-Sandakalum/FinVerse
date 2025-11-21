/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IngestResponse = {
    /**
     * Status of the ingestion operation
     */
    status: IngestResponse.status;
    /**
     * Descriptive message about the operation
     */
    message: string;
    /**
     * Number of products successfully ingested
     */
    ingested_count: number;
};
export namespace IngestResponse {
    /**
     * Status of the ingestion operation
     */
    export enum status {
        SUCCESS = 'success',
        ERROR = 'error',
    }
}

