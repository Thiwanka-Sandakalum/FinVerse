// src/modules/organizations/org.types.ts

export interface OrganizationBranding {
    logo_url?: string;
    colors?: {
        primary?: string;
        page_background?: string;
    };
}

export enum IndustryType {
    Bank = "Bank",
    Insurance = "Insurance",
    Fintech = "Fintech",
    CreditUnion = "CreditUnion",
    InvestmentFirm = "InvestmentFirm",
    PaymentProvider = "PaymentProvider",
    Microfinance = "Microfinance",
    LeasingCompany = "LeasingCompany",
    FinanceCompany = "FinanceCompany",
    StockBroker = "StockBroker",
    UnitTrust = "UnitTrust",
    PawnBroker = "PawnBroker",
    MoneyTransfer = "MoneyTransfer",
    DevelopmentBank = "DevelopmentBank",
    CooperativeSociety = "CooperativeSociety",
    InsuranceBroker = "InsuranceBroker",
    Other = "Other"
}

export enum SupportedProduct {
    SavingsAccount = "SavingsAccount",
    CurrentAccount = "CurrentAccount",
    FixedDeposit = "FixedDeposit",
    PersonalLoan = "PersonalLoan",
    HomeLoan = "HomeLoan",
    Leasing = "Leasing",
    Microfinance = "Microfinance",
    CreditCard = "CreditCard",
    DebitCard = "DebitCard",
    Insurance = "Insurance",
    LifeInsurance = "LifeInsurance",
    GeneralInsurance = "GeneralInsurance",
    Investment = "Investment",
    StockTrading = "StockTrading",
    UnitTrust = "UnitTrust",
    Remittance = "Remittance",
    MobileBanking = "MobileBanking",
    InternetBanking = "InternetBanking",
    PaymentGateway = "PaymentGateway",
    PawnBroking = "PawnBroking",
    Other = "Other"
}

export interface OrganizationMetadata {
    description?: string;
    industryType?: IndustryType;
    registrationNumber?: string;
    country?: string;
    region?: string;
    headquartersAddress?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    establishedYear?: string;
    supportedProducts?: SupportedProduct[];
    numberOfBranches?: string;
    numberOfEmployees?: string;
    logoUrl?: string;
    swiftCode?: string;
}

export interface OrganizationCreateRequest {
    name: string;
    display_name?: string;
    metadata: OrganizationMetadata;
    enabled_connections?: any[];
}

export interface Organization {
    id: string;
    name: string;
    display_name?: string;
    branding?: OrganizationBranding;
    metadata?: OrganizationMetadata;
    enabled_connections?: any[];
}
