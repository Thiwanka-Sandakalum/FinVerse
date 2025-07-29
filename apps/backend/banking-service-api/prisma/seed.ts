import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed operation...');

    // InstitutionType seed data
    const bankType = await prisma.institutionType.upsert({
        where: { code: 'BANK' },
        update: {},
        create: {
            id: uuidv4(),
            code: 'BANK',
            name: 'Banking Institution',
            description: 'Financial institution that accepts deposits and offers various banking services',
        },
    });

    const insuranceType = await prisma.institutionType.upsert({
        where: { code: 'INSURANCE' },
        update: {},
        create: {
            id: uuidv4(),
            code: 'INSURANCE',
            name: 'Insurance Company',
            description: 'Financial institution that provides insurance products and services',
        },
    });

    const investmentType = await prisma.institutionType.upsert({
        where: { code: 'INVESTMENT' },
        update: {},
        create: {
            id: uuidv4(),
            code: 'INVESTMENT',
            name: 'Investment Company',
            description: 'Financial institution that offers various investment products and services',
        },
    });

    console.log('Created institution types:', { bankType, insuranceType, investmentType });

    // Create institutions
    const bank1 = await prisma.institution.upsert({
        where: { slug: 'first-national-bank' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'First National Bank',
            slug: 'first-national-bank',
            typeId: bankType.id,
            logoUrl: 'https://example.com/logos/first-national-bank.png',
            licenseNumber: 'BNK12345',
            countryCode: 'US',
            isActive: true,
        },
    });

    const bank2 = await prisma.institution.upsert({
        where: { slug: 'metro-credit-union' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Metro Credit Union',
            slug: 'metro-credit-union',
            typeId: bankType.id,
            logoUrl: 'https://example.com/logos/metro-credit-union.png',
            licenseNumber: 'BNK67890',
            countryCode: 'US',
            isActive: true,
        },
    });

    const insurance1 = await prisma.institution.upsert({
        where: { slug: 'pacific-insurance' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Pacific Insurance',
            slug: 'pacific-insurance',
            typeId: insuranceType.id,
            logoUrl: 'https://example.com/logos/pacific-insurance.png',
            licenseNumber: 'INS12345',
            countryCode: 'US',
            isActive: true,
        },
    });

    const investment1 = await prisma.institution.upsert({
        where: { slug: 'summit-investments' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Summit Investments',
            slug: 'summit-investments',
            typeId: investmentType.id,
            logoUrl: 'https://example.com/logos/summit-investments.png',
            licenseNumber: 'INV12345',
            countryCode: 'US',
            isActive: true,
        },
    });

    console.log('Created institutions:', { bank1, bank2, insurance1, investment1 });

    // Create product categories
    const savingsCategory = await prisma.productCategory.upsert({
        where: { slug: 'savings' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Savings',
            slug: 'savings',
            description: 'Products designed to help customers save money',
            level: 0,
        },
    });

    const loansCategory = await prisma.productCategory.upsert({
        where: { slug: 'loans' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Loans',
            slug: 'loans',
            description: 'Various loan products offered by financial institutions',
            level: 0,
        },
    });

    const insuranceCategory = await prisma.productCategory.upsert({
        where: { slug: 'insurance' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Insurance',
            slug: 'insurance',
            description: 'Insurance products to protect against financial risks',
            level: 0,
        },
    });

    const investmentCategory = await prisma.productCategory.upsert({
        where: { slug: 'investments' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Investments',
            slug: 'investments',
            description: 'Investment products for wealth growth',
            level: 0,
        },
    });

    console.log('Created product categories:', { savingsCategory, loansCategory, insuranceCategory, investmentCategory });

    // Create product types
    const savingsAccountType = await prisma.productType.upsert({
        where: { code: 'SAVINGS_ACCOUNT' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: savingsCategory.id,
            code: 'SAVINGS_ACCOUNT',
            name: 'Savings Account',
            description: 'Basic savings account for personal use',
        },
    });

    const cdAccountType = await prisma.productType.upsert({
        where: { code: 'CD_ACCOUNT' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: savingsCategory.id,
            code: 'CD_ACCOUNT',
            name: 'Certificate of Deposit',
            description: 'Fixed-term deposit account with higher interest rates',
        },
    });

    const personalLoanType = await prisma.productType.upsert({
        where: { code: 'PERSONAL_LOAN' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: loansCategory.id,
            code: 'PERSONAL_LOAN',
            name: 'Personal Loan',
            description: 'Unsecured loan for personal use',
        },
    });

    const mortgageLoanType = await prisma.productType.upsert({
        where: { code: 'MORTGAGE_LOAN' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: loansCategory.id,
            code: 'MORTGAGE_LOAN',
            name: 'Mortgage Loan',
            description: 'Loan secured by real estate property',
        },
    });

    const lifeInsuranceType = await prisma.productType.upsert({
        where: { code: 'LIFE_INSURANCE' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: insuranceCategory.id,
            code: 'LIFE_INSURANCE',
            name: 'Life Insurance',
            description: 'Insurance that pays a benefit upon the death of the insured',
        },
    });

    const healthInsuranceType = await prisma.productType.upsert({
        where: { code: 'HEALTH_INSURANCE' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: insuranceCategory.id,
            code: 'HEALTH_INSURANCE',
            name: 'Health Insurance',
            description: 'Insurance that covers medical expenses',
        },
    });

    const stocksType = await prisma.productType.upsert({
        where: { code: 'STOCKS' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: investmentCategory.id,
            code: 'STOCKS',
            name: 'Stocks',
            description: 'Ownership shares in publicly traded companies',
        },
    });

    const mutualFundType = await prisma.productType.upsert({
        where: { code: 'MUTUAL_FUND' },
        update: {},
        create: {
            id: uuidv4(),
            categoryId: investmentCategory.id,
            code: 'MUTUAL_FUND',
            name: 'Mutual Fund',
            description: 'Professionally managed investment fund',
        },
    });

    console.log('Created product types');

    // Create product tags
    const highYieldTag = await prisma.productTag.upsert({
        where: { slug: 'high-yield' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'High Yield',
            slug: 'high-yield',
        },
    });

    const noFeesTag = await prisma.productTag.upsert({
        where: { slug: 'no-fees' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'No Fees',
            slug: 'no-fees',
        },
    });

    const recommendedTag = await prisma.productTag.upsert({
        where: { slug: 'recommended' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'Recommended',
            slug: 'recommended',
        },
    });

    const newCustomersTag = await prisma.productTag.upsert({
        where: { slug: 'new-customers' },
        update: {},
        create: {
            id: uuidv4(),
            name: 'For New Customers',
            slug: 'new-customers',
        },
    });

    console.log('Created product tags');

    // Create products
    // ========== SAVINGS PRODUCTS ==========
    // Savings Account Product 1
    const savingsProduct1 = await prisma.product.upsert({
        where: { slug: 'first-national-high-yield-savings' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: savingsAccountType.id,
            name: 'High Yield Savings Account',
            slug: 'first-national-high-yield-savings',
            details: {
                interestRate: 3.5,
                minimumBalance: 1000,
                monthlyFee: 0,
                annualPercentageYield: 3.55,
                compoundingFrequency: 'Daily',
                features: [
                    'No monthly maintenance fees',
                    'Mobile banking access',
                    'FDIC insured up to $250,000',
                    'Unlimited deposits',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $1,000'],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Create product tags mapping for savingsProduct1
    await prisma.productTagMap.create({
        data: {
            productId: savingsProduct1.id,
            tagId: highYieldTag.id,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: savingsProduct1.id,
            tagId: recommendedTag.id,
        },
    });

    // Savings Account Product 2
    const savingsProduct2 = await prisma.product.upsert({
        where: { slug: 'metro-student-savings' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: savingsAccountType.id,
            name: 'Student Savings Account',
            slug: 'metro-student-savings',
            details: {
                interestRate: 2.75,
                minimumBalance: 0,
                monthlyFee: 0,
                annualPercentageYield: 2.78,
                compoundingFrequency: 'Daily',
                features: [
                    'No minimum balance requirement',
                    'No monthly fees',
                    'Mobile banking with budgeting tools',
                    'Free financial education resources',
                ],
                requirements: ['Valid student ID', 'SSN', 'Under age 24'],
                eligibility: 'Current students enrolled in accredited educational institutions',
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Savings Account Product 3
    const savingsProduct3 = await prisma.product.upsert({
        where: { slug: 'first-national-goal-saver' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: savingsAccountType.id,
            name: 'Goal Saver Account',
            slug: 'first-national-goal-saver',
            details: {
                interestRate: 3.0,
                minimumBalance: 500,
                monthlyFee: 0,
                annualPercentageYield: 3.04,
                compoundingFrequency: 'Daily',
                features: [
                    'Create multiple savings goals',
                    'Goal tracking and visualization tools',
                    'Automatic transfers from checking account',
                    'Bonus interest rate when goals are met',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $500', 'Linked checking account'],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // ========== CD ACCOUNT PRODUCTS ==========
    // CD Account Product 1
    const cdProduct1 = await prisma.product.upsert({
        where: { slug: 'metro-premium-cd' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: cdAccountType.id,
            name: 'Premium Certificate of Deposit',
            slug: 'metro-premium-cd',
            details: {
                interestRate: 4.25,
                term: 12, // months
                minimumDeposit: 5000,
                earlyWithdrawalPenalty: '3 months of interest',
                annualPercentageYield: 4.32,
                features: [
                    'Guaranteed rate of return',
                    'FDIC insured up to $250,000',
                    'Fixed term of 12 months',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $5,000'],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Create product tags mapping for cdProduct1
    await prisma.productTagMap.create({
        data: {
            productId: cdProduct1.id,
            tagId: highYieldTag.id,
        },
    });

    // CD Account Product 2
    const cdProduct2 = await prisma.product.upsert({
        where: { slug: 'first-national-long-term-cd' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: cdAccountType.id,
            name: '5-Year Growth CD',
            slug: 'first-national-long-term-cd',
            details: {
                interestRate: 4.85,
                term: 60, // months
                minimumDeposit: 10000,
                earlyWithdrawalPenalty: '12 months of interest',
                annualPercentageYield: 4.95,
                features: [
                    'Highest rate of return for long-term savings',
                    'Interest rate locked for 5 years',
                    'FDIC insured up to $250,000',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $10,000'],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: cdProduct2.id,
            tagId: highYieldTag.id,
        },
    });

    // CD Account Product 3
    const cdProduct3 = await prisma.product.upsert({
        where: { slug: 'metro-no-penalty-cd' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: cdAccountType.id,
            name: 'No-Penalty CD',
            slug: 'metro-no-penalty-cd',
            details: {
                interestRate: 3.65,
                term: 11, // months
                minimumDeposit: 1000,
                earlyWithdrawalPenalty: 'None after 7 days',
                annualPercentageYield: 3.70,
                features: [
                    'Withdraw your full balance without penalty after 7 days',
                    'Fixed rate of return',
                    'FDIC insured up to $250,000',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $1,000'],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // ========== PERSONAL LOAN PRODUCTS ==========
    // Personal Loan Product 1
    const loanProduct1 = await prisma.product.upsert({
        where: { slug: 'first-national-personal-loan' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: personalLoanType.id,
            name: 'Flexible Personal Loan',
            slug: 'first-national-personal-loan',
            details: {
                interestRate: 7.99,
                loanAmountMin: 5000,
                loanAmountMax: 50000,
                termMin: 12, // months
                termMax: 60, // months
                originationFee: 1.5, // percentage
                annualPercentageRate: 8.45,
                features: [
                    'No prepayment penalties',
                    'Fixed monthly payments',
                    'Quick approval process',
                ],
                requirements: [
                    'Credit score of 680+',
                    'Proof of income',
                    'Valid ID',
                    'SSN',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Create product tags mapping for loanProduct1
    await prisma.productTagMap.create({
        data: {
            productId: loanProduct1.id,
            tagId: newCustomersTag.id,
        },
    });

    // Personal Loan Product 2
    const loanProduct2 = await prisma.product.upsert({
        where: { slug: 'metro-debt-consolidation-loan' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: personalLoanType.id,
            name: 'Debt Consolidation Loan',
            slug: 'metro-debt-consolidation-loan',
            details: {
                interestRate: 6.75,
                loanAmountMin: 10000,
                loanAmountMax: 75000,
                termMin: 24, // months
                termMax: 84, // months
                originationFee: 0.75, // percentage
                annualPercentageRate: 7.05,
                features: [
                    'Consolidate high-interest debt into one payment',
                    'Potentially lower overall interest rate',
                    'Fixed payment schedule',
                    'Free debt counseling services',
                ],
                requirements: [
                    'Credit score of 700+',
                    'Debt-to-income ratio below 45%',
                    'Proof of income',
                    'Verification of existing debts',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: loanProduct2.id,
            tagId: recommendedTag.id,
        },
    });

    // Personal Loan Product 3
    const loanProduct3 = await prisma.product.upsert({
        where: { slug: 'first-national-education-loan' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: personalLoanType.id,
            name: 'Education Enhancement Loan',
            slug: 'first-national-education-loan',
            details: {
                interestRate: 5.50,
                loanAmountMin: 3000,
                loanAmountMax: 30000,
                termMin: 12, // months
                termMax: 72, // months
                originationFee: 1.0, // percentage
                annualPercentageRate: 5.95,
                features: [
                    'Designed for professional development or continuing education',
                    'Interest-only payments while in school',
                    'Flexible repayment options after graduation',
                    'Discounted rates for automatic payments',
                ],
                requirements: [
                    'Enrollment proof in eligible program',
                    'Credit score of 640+',
                    'Co-signer option for lower rates',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // ========== MORTGAGE PRODUCTS ==========
    // Mortgage Loan Product 1
    const mortgageProduct1 = await prisma.product.upsert({
        where: { slug: 'metro-fixed-rate-mortgage' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: mortgageLoanType.id,
            name: '30-Year Fixed Rate Mortgage',
            slug: 'metro-fixed-rate-mortgage',
            details: {
                interestRate: 5.75,
                loanAmountMin: 100000,
                loanAmountMax: 1000000,
                term: 360, // months (30 years)
                originationFee: 1.0, // percentage
                annualPercentageRate: 5.99,
                downPaymentMin: 20, // percentage
                features: [
                    'Fixed interest rate for the life of the loan',
                    'Stable monthly payments',
                    'No prepayment penalties',
                ],
                requirements: [
                    'Credit score of 720+',
                    'Debt-to-income ratio below 43%',
                    'Proof of income and assets',
                    'Property appraisal',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Mortgage Product 2
    const mortgageProduct2 = await prisma.product.upsert({
        where: { slug: 'first-national-adjustable-rate-mortgage' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank1.id,
            productTypeId: mortgageLoanType.id,
            name: '7/1 ARM Mortgage',
            slug: 'first-national-adjustable-rate-mortgage',
            details: {
                interestRate: 5.25, // initial rate
                loanAmountMin: 100000,
                loanAmountMax: 1500000,
                initialFixedPeriod: 84, // months (7 years)
                term: 360, // months (30 years)
                rateCapFirstAdjustment: 2.0, // percentage
                rateCapSubsequentAdjustments: 1.0, // percentage
                lifetimeRateCap: 5.0, // percentage
                adjustmentFrequency: 12, // months (yearly)
                originationFee: 0.75, // percentage
                annualPercentageRate: 5.45,
                downPaymentMin: 10, // percentage
                features: [
                    'Lower initial rate than fixed-rate mortgages',
                    'Rate fixed for first 7 years',
                    'Rate adjusts annually after fixed period',
                    'Possible for rate to decrease after adjustment',
                ],
                requirements: [
                    'Credit score of 700+',
                    'Debt-to-income ratio below 45%',
                    'Proof of income and assets',
                    'Property appraisal',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Mortgage Product 3
    const mortgageProduct3 = await prisma.product.upsert({
        where: { slug: 'metro-first-time-homebuyer' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: bank2.id,
            productTypeId: mortgageLoanType.id,
            name: 'First-Time Homebuyer Mortgage',
            slug: 'metro-first-time-homebuyer',
            details: {
                interestRate: 5.50,
                loanAmountMin: 75000,
                loanAmountMax: 500000,
                term: 360, // months (30 years)
                originationFee: 0.5, // percentage
                annualPercentageRate: 5.65,
                downPaymentMin: 3, // percentage
                features: [
                    'Low down payment options',
                    'Down payment assistance programs',
                    'Homebuyer education course included',
                    'Reduced mortgage insurance options',
                    'Closing cost assistance available',
                ],
                requirements: [
                    'First-time homebuyer status',
                    'Credit score of 640+',
                    'Completion of homebuyer education course',
                    'Property must be primary residence',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: mortgageProduct3.id,
            tagId: recommendedTag.id,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: mortgageProduct3.id,
            tagId: newCustomersTag.id,
        },
    });

    // ========== INSURANCE PRODUCTS ==========
    // Life Insurance Product 1
    const lifeInsuranceProduct1 = await prisma.product.upsert({
        where: { slug: 'pacific-term-life-insurance' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: insurance1.id,
            productTypeId: lifeInsuranceType.id,
            name: '20-Year Term Life Insurance',
            slug: 'pacific-term-life-insurance',
            details: {
                term: 20, // years
                coverageMin: 100000,
                coverageMax: 1000000,
                monthlyPremiumExample: 25, // for $250,000 coverage, 35-year-old non-smoker
                features: [
                    'Level premiums for 20 years',
                    'Death benefit paid tax-free to beneficiaries',
                    'Conversion option to permanent insurance',
                ],
                requirements: [
                    'Medical examination',
                    'Health questionnaire',
                    'Valid ID',
                    'Proof of income',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Life Insurance Product 2
    const lifeInsuranceProduct2 = await prisma.product.upsert({
        where: { slug: 'pacific-whole-life-insurance' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: insurance1.id,
            productTypeId: lifeInsuranceType.id,
            name: 'Whole Life Insurance',
            slug: 'pacific-whole-life-insurance',
            details: {
                coverageMin: 50000,
                coverageMax: 2000000,
                monthlyPremiumExample: 95, // for $250,000 coverage, 35-year-old non-smoker
                cashValueAccumulation: true,
                dividendEligible: true,
                features: [
                    'Lifetime coverage',
                    'Fixed premiums that never increase',
                    'Builds cash value over time',
                    'Potential for dividend payments',
                    'Can borrow against cash value',
                ],
                requirements: [
                    'Comprehensive medical examination',
                    'Health questionnaire',
                    'Financial underwriting',
                    'Valid ID',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Health Insurance Product 1
    const healthInsuranceProduct1 = await prisma.product.upsert({
        where: { slug: 'pacific-premium-health-plan' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: insurance1.id,
            productTypeId: healthInsuranceType.id,
            name: 'Premium Health Insurance Plan',
            slug: 'pacific-premium-health-plan',
            details: {
                monthlyPremium: 450, // for individual, age 35
                familyPlanAvailable: true,
                annualDeductible: 1000,
                outOfPocketMax: 5000,
                coinsurance: 10, // percentage
                networkType: 'PPO',
                prescriptionCoverage: true,
                features: [
                    'Large network of physicians and specialists',
                    'Low out-of-pocket costs',
                    'Comprehensive prescription drug coverage',
                    'Coverage for preventive services with no copay',
                    'Telemedicine services included',
                ],
                requirements: [
                    'Open enrollment period or qualifying life event',
                    'Residency in covered service area',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Health Insurance Product 2
    const healthInsuranceProduct2 = await prisma.product.upsert({
        where: { slug: 'pacific-essential-health-plan' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: insurance1.id,
            productTypeId: healthInsuranceType.id,
            name: 'Essential Health Insurance Plan',
            slug: 'pacific-essential-health-plan',
            details: {
                monthlyPremium: 275, // for individual, age 35
                familyPlanAvailable: true,
                annualDeductible: 3500,
                outOfPocketMax: 8000,
                coinsurance: 20, // percentage
                networkType: 'HMO',
                prescriptionCoverage: true,
                features: [
                    'Affordable monthly premiums',
                    'Focus on preventive care',
                    'Generic prescription drug coverage',
                    'Primary care physician assignment required',
                    'Referrals needed for specialist visits',
                ],
                requirements: [
                    'Open enrollment period or qualifying life event',
                    'Residency in covered service area',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // ========== INVESTMENT PRODUCTS ==========
    // Investment Product - Mutual Fund 1
    const mutualFundProduct1 = await prisma.product.upsert({
        where: { slug: 'summit-growth-fund' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: investment1.id,
            productTypeId: mutualFundType.id,
            name: 'Summit Growth Fund',
            slug: 'summit-growth-fund',
            details: {
                expenseRatio: 0.65, // percentage
                minimumInvestment: 2500,
                fundType: 'Growth',
                assetClasses: ['Domestic Stocks', 'International Stocks', 'Bonds'],
                riskLevel: 'Moderate',
                historicalReturns: {
                    oneYear: 8.5,
                    threeYear: 7.2,
                    fiveYear: 9.1,
                    tenYear: 8.7,
                },
                features: [
                    'Professional portfolio management',
                    'Diversification across asset classes',
                    'Automatic dividend reinvestment',
                ],
                requirements: [
                    'Valid ID',
                    'SSN or Tax ID',
                    'Minimum initial investment of $2,500',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    // Mutual Fund Product 2
    const mutualFundProduct2 = await prisma.product.upsert({
        where: { slug: 'summit-dividend-income-fund' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: investment1.id,
            productTypeId: mutualFundType.id,
            name: 'Dividend Income Fund',
            slug: 'summit-dividend-income-fund',
            details: {
                expenseRatio: 0.58, // percentage
                minimumInvestment: 5000,
                fundType: 'Income',
                assetClasses: ['Dividend Stocks', 'Preferred Stocks', 'REITs'],
                riskLevel: 'Moderate-Low',
                distributionYield: 3.2, // percentage
                distributionFrequency: 'Quarterly',
                historicalReturns: {
                    oneYear: 6.8,
                    threeYear: 5.9,
                    fiveYear: 7.2,
                    tenYear: 7.5,
                },
                features: [
                    'Focus on companies with strong dividend history',
                    'Regular income distribution',
                    'Lower volatility than growth funds',
                    'Option for automatic reinvestment or cash distribution',
                ],
                requirements: [
                    'Valid ID',
                    'SSN or Tax ID',
                    'Minimum initial investment of $5,000',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Stock Investment Product
    const stocksProduct1 = await prisma.product.upsert({
        where: { slug: 'summit-stock-brokerage-account' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: investment1.id,
            productTypeId: stocksType.id,
            name: 'Premier Stock Brokerage Account',
            slug: 'summit-stock-brokerage-account',
            details: {
                accountMinimum: 0,
                tradingFee: 0, // per trade
                maintenanceFee: 0, // monthly
                marginAvailable: true,
                marginRate: 7.5, // percentage
                tradingPlatforms: ['Web', 'Mobile', 'Desktop'],
                researchTools: ['Analyst Reports', 'Stock Screener', 'Technical Analysis', 'News Integration'],
                features: [
                    'Commission-free stock and ETF trades',
                    'Advanced charting capabilities',
                    'Real-time market data',
                    'Pre and post-market trading',
                    'Dividend reinvestment program',
                    'Fractional shares available',
                ],
                requirements: [
                    'Valid ID',
                    'SSN or Tax ID',
                    'Bank account for funding',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: stocksProduct1.id,
            tagId: noFeesTag.id,
        },
    });

    // Mutual Fund Product 3
    const mutualFundProduct3 = await prisma.product.upsert({
        where: { slug: 'summit-bond-fund' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: investment1.id,
            productTypeId: mutualFundType.id,
            name: 'Fixed Income Bond Fund',
            slug: 'summit-bond-fund',
            details: {
                expenseRatio: 0.45, // percentage
                minimumInvestment: 3000,
                fundType: 'Bond',
                bondTypes: ['Government', 'Corporate', 'Municipal'],
                creditQuality: 'Investment Grade',
                averageDuration: 5.2, // years
                riskLevel: 'Low',
                yieldToMaturity: 3.8, // percentage
                distributionFrequency: 'Monthly',
                historicalReturns: {
                    oneYear: 4.2,
                    threeYear: 3.8,
                    fiveYear: 4.5,
                    tenYear: 4.1,
                },
                features: [
                    'Steady income generation',
                    'Lower volatility than stock funds',
                    'Diversification across bond issuers and maturities',
                    'Regular monthly income distribution',
                ],
                requirements: [
                    'Valid ID',
                    'SSN or Tax ID',
                    'Minimum initial investment of $3,000',
                ],
            },
            isFeatured: false,
            isActive: true,
        },
    });

    // Mutual Fund Product 4
    const mutualFundProduct4 = await prisma.product.upsert({
        where: { slug: 'summit-target-retirement-2050' },
        update: {},
        create: {
            id: uuidv4(),
            institutionId: investment1.id,
            productTypeId: mutualFundType.id,
            name: 'Target Retirement 2050 Fund',
            slug: 'summit-target-retirement-2050',
            details: {
                expenseRatio: 0.12, // percentage
                minimumInvestment: 1000,
                fundType: 'Target Date',
                currentAllocation: {
                    stocks: 90,
                    bonds: 10,
                    cash: 0,
                },
                glidePathDescription: 'Gradually becomes more conservative as 2050 approaches and beyond',
                riskLevel: 'Moderate-High',
                historicalReturns: {
                    oneYear: 9.2,
                    threeYear: 8.5,
                    fiveYear: 10.1,
                    tenYear: 9.7,
                },
                features: [
                    'Automatically adjusts asset allocation over time',
                    'Designed for investors planning to retire around 2050',
                    'Broadly diversified across domestic and international markets',
                    'Professional rebalancing and management',
                    'Low expense ratio',
                ],
                requirements: [
                    'Valid ID',
                    'SSN or Tax ID',
                    'Retirement account (IRA, 401k, etc.)',
                    'Minimum initial investment of $1,000',
                ],
            },
            isFeatured: true,
            isActive: true,
        },
    });

    await prisma.productTagMap.create({
        data: {
            productId: mutualFundProduct4.id,
            tagId: recommendedTag.id,
        },
    });

    // Create product version history
    console.log('Creating product version history...');

    // Savings accounts version history
    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            versionNumber: 1,
            snapshot: savingsProduct1.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct2.id,
            versionNumber: 1,
            snapshot: savingsProduct2.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct3.id,
            versionNumber: 1,
            snapshot: savingsProduct3.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    // CD accounts version history
    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: cdProduct1.id,
            versionNumber: 1,
            snapshot: cdProduct1.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: cdProduct2.id,
            versionNumber: 1,
            snapshot: cdProduct2.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    // Mortgage products version history
    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct1.id,
            versionNumber: 1,
            snapshot: mortgageProduct1.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct2.id,
            versionNumber: 1,
            snapshot: mortgageProduct2.details as any,
            changedBy: 'seed-script',
            changeNote: 'Initial product creation',
        },
    });

    // Version history with multiple versions to demonstrate history
    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            versionNumber: 2,
            snapshot: {
                interestRate: 3.25, // Previous lower rate
                minimumBalance: 1000,
                monthlyFee: 0,
                annualPercentageYield: 3.30,
                compoundingFrequency: 'Daily',
                features: [
                    'No monthly maintenance fees',
                    'Mobile banking access',
                    'FDIC insured up to $250,000',
                    'Unlimited deposits',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $1,000'],
            } as any,
            changedBy: 'seed-script',
            changeNote: 'Updated interest rate from 3.25% to 3.5%',
        },
    });

    await prisma.productVersion.create({
        data: {
            id: uuidv4(),
            productId: cdProduct2.id,
            versionNumber: 2,
            snapshot: {
                interestRate: 4.65, // Previous rate
                term: 60,
                minimumDeposit: 10000,
                earlyWithdrawalPenalty: '12 months of interest',
                annualPercentageYield: 4.75,
                features: [
                    'Highest rate of return for long-term savings',
                    'Interest rate locked for 5 years',
                    'FDIC insured up to $250,000',
                ],
                requirements: ['Valid ID', 'SSN', 'Initial deposit of $10,000'],
            } as any,
            changedBy: 'seed-script',
            changeNote: 'Rate increase from 4.65% to 4.85% due to Fed policy change',
        },
    });

    // Create product rate history
    console.log('Creating product rate history...');

    // Savings accounts rate history
    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            metric: 'interestRate',
            value: 3.5,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            metric: 'interestRate',
            value: 3.25,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            metric: 'interestRate',
            value: 3.0,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct2.id,
            metric: 'interestRate',
            value: 2.75,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct3.id,
            metric: 'interestRate',
            value: 3.0,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    // CD accounts rate history
    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: cdProduct1.id,
            metric: 'interestRate',
            value: 4.25,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: cdProduct1.id,
            metric: 'interestRate',
            value: 4.0,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: cdProduct2.id,
            metric: 'interestRate',
            value: 4.85,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: cdProduct2.id,
            metric: 'interestRate',
            value: 4.65,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: cdProduct3.id,
            metric: 'interestRate',
            value: 3.65,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    // Loan product rate history
    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: loanProduct1.id,
            metric: 'interestRate',
            value: 7.99,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: loanProduct2.id,
            metric: 'interestRate',
            value: 6.75,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    // Mortgage products rate history
    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct1.id,
            metric: 'interestRate',
            value: 5.75,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct1.id,
            metric: 'interestRate',
            value: 5.5,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct1.id,
            metric: 'interestRate',
            value: 5.25,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    await prisma.productRateHistory.create({
        data: {
            id: uuidv4(),
            productId: mortgageProduct2.id,
            metric: 'interestRate',
            value: 5.25,
            currency: 'USD',
            source: 'seed-script',
        },
    });

    // Create some sample reviews
    console.log('Creating sample product reviews...');

    // Reviews for savings account
    await prisma.review.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_1',
            productId: savingsProduct1.id,
            rating: 5,
            comment: 'Excellent savings account with competitive rates. The mobile app makes it easy to manage my money.',
        },
    });

    await prisma.review.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_2',
            productId: savingsProduct1.id,
            rating: 4,
            comment: 'Very good interest rate compared to other banks. Would be perfect if the minimum balance requirement was lower.',
        },
    });

    // Reviews for CD account
    await prisma.review.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_3',
            productId: cdProduct1.id,
            rating: 5,
            comment: 'The guaranteed returns have given me peace of mind. Customer service was helpful in setting up my account.',
        },
    });

    // Reviews for mortgage product
    await prisma.review.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_1',
            productId: mortgageProduct1.id,
            rating: 4,
            comment: 'Smooth application process and fair rates. The only downside was the amount of paperwork required.',
        },
    });

    await prisma.review.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_4',
            productId: mortgageProduct3.id,
            rating: 5,
            comment: 'As a first-time homebuyer, I really appreciated the educational resources and lower down payment option.',
        },
    });

    // Sample saved products
    console.log('Creating sample saved products...');

    await prisma.savedProduct.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_1',
            productId: savingsProduct1.id,
        },
    });

    await prisma.savedProduct.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_1',
            productId: mortgageProduct3.id,
        },
    });

    await prisma.savedProduct.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_2',
            productId: cdProduct2.id,
        },
    });

    // Sample compare lists
    console.log('Creating sample compare lists...');

    await prisma.compareList.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_1',
            productIds: [savingsProduct1.id, savingsProduct2.id, savingsProduct3.id],
        },
    });

    await prisma.compareList.create({
        data: {
            id: uuidv4(),
            clerkUserId: 'user_2',
            productIds: [mortgageProduct1.id, mortgageProduct2.id],
        },
    });

    // Sample shared links
    console.log('Creating sample shared links...');

    await prisma.sharedLink.create({
        data: {
            id: uuidv4(),
            productId: savingsProduct1.id,
            clerkUserId: 'user_1',
            channel: 'email',
        },
    });

    await prisma.sharedLink.create({
        data: {
            id: uuidv4(),
            productId: cdProduct1.id,
            clerkUserId: 'user_3',
            channel: 'whatsapp',
        },
    });

    console.log('Seed operation completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error during seed operation:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
