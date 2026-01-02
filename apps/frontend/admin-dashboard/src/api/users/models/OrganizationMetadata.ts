/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizationMetadata = {
    industryType?: OrganizationMetadata.industryType;
    country?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
};
export namespace OrganizationMetadata {
    export enum industryType {
        BANK = 'Bank',
        INSURANCE = 'Insurance',
        FINTECH = 'Fintech',
        CREDIT_UNION = 'CreditUnion',
        INVESTMENT_FIRM = 'InvestmentFirm',
        PAYMENT_PROVIDER = 'PaymentProvider',
        MICROFINANCE = 'Microfinance',
        OTHER = 'Other',
    }
}

