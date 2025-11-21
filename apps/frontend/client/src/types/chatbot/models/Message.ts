/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Message = {
    /**
     * Message content
     */
    text: string;
    /**
     * Role of the message sender
     */
    role: Message.role;
    /**
     * ISO 8601 timestamp of the message
     */
    timestamp?: string | null;
};
export namespace Message {
    /**
     * Role of the message sender
     */
    export enum role {
        USER = 'user',
        ASSISTANT = 'assistant',
    }
}

