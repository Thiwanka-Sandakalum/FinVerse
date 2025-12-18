/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StaticService {
    /**
     * Serve main application page
     * Returns the main HTML interface for the chatbot
     * @returns string HTML page
     * @throws ApiError
     */
    public static get(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
}
