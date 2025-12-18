/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Organization = {
    id: string;
    name: string;
    display_name?: string;
    branding?: {
        logo_url?: string;
        colors?: Record<string, string>;
    };
    enabled_connections?: Array<{
        connection_id: string;
        assign_membership_on_login?: boolean;
        show_as_button?: boolean;
        is_signup_enabled?: boolean;
    }>;
    metadata: {
        description?: string;
        industryType?: Organization.industryType;
        registrationNumber?: string;
        country?: string;
        region?: string;
        headquartersAddress?: string;
        contactEmail?: string;
        contactPhone?: string;
        website?: string;
        establishedYear?: string;
        supportedProducts?: Array<'SavingsAccount' | 'CurrentAccount' | 'FixedDeposit' | 'PersonalLoan' | 'HomeLoan' | 'Leasing' | 'Microfinance' | 'CreditCard' | 'DebitCard' | 'Insurance' | 'LifeInsurance' | 'GeneralInsurance' | 'Investment' | 'StockTrading' | 'UnitTrust' | 'Remittance' | 'MobileBanking' | 'InternetBanking' | 'PaymentGateway' | 'PawnBroking' | 'Other'>;
        numberOfBranches?: string;
        numberOfEmployees?: string;
        logoUrl?: string;
        swiftCode?: string;
    };
};
export namespace Organization {
    export enum industryType {
        BANK = 'Bank',
        INSURANCE = 'Insurance',
        FINTECH = 'Fintech',
        CREDIT_UNION = 'CreditUnion',
        INVESTMENT_FIRM = 'InvestmentFirm',
        PAYMENT_PROVIDER = 'PaymentProvider',
        MICROFINANCE = 'Microfinance',
        LEASING_COMPANY = 'LeasingCompany',
        FINANCE_COMPANY = 'FinanceCompany',
        STOCK_BROKER = 'StockBroker',
        UNIT_TRUST = 'UnitTrust',
        PAWN_BROKER = 'PawnBroker',
        MONEY_TRANSFER = 'MoneyTransfer',
        DEVELOPMENT_BANK = 'DevelopmentBank',
        COOPERATIVE_SOCIETY = 'CooperativeSociety',
        INSURANCE_BROKER = 'InsuranceBroker',
        OTHER = 'Other',
    }
}

