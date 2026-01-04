export type Page = 'dashboard' | 'organizations' | 'users' | 'products' | 'settings' | 'login';

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  VIEWER = 'Viewer',
  SUPER_ADMIN = 'Super Admin',
  ORG_ADMIN = 'Org Admin'
}

export enum Status {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  INACTIVE = 'Inactive',
  REJECTED = 'Rejected',
  SUSPENDED = 'Suspended',
  DRAFT = 'Draft',
  INVITED = 'Invited',
  DISABLED = 'Disabled',
  LOCKED = 'Locked'
}

export interface UserOrgMembership {
  orgId: string;
  orgName: string;
  role: UserRole;
  joinedDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole; // System Level Role
  organization: string; // Primary Organization Name (for display compatibility)
  orgMemberships: UserOrgMembership[];
  status: Status;
  lastLogin: string;
  mfaEnabled: boolean;
  authProvider: 'Auth0' | 'Google' | 'Microsoft';
  auth0Id: string;
  invitedBy?: string;
  createdDate: string;
  avatar?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ip: string;
  details: string;
}

export interface OrganizationBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  darkTheme: boolean;
}

export interface OrganizationCapabilities {
  productTypes: string[]; // 'Loan', 'Lease', 'Card', 'Account', 'Investment'
  maxProducts: number;
  apiAccess: boolean;
  sandboxMode: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Bank' | 'Microfinance' | 'Fintech' | 'Leasing';
  registrationNumber: string;
  country: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  branches: number;
  status: Status;
  createdDate: string;
  activeProducts: number;
  branding: OrganizationBranding;
  capabilities: OrganizationCapabilities;
}

export interface OrganizationActivity {
  id: string;
  orgId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export type ProductType = 'Loan' | 'Lease' | 'Card' | 'Account' | 'Investment';

export interface ProductFinancialRules {
  minAmount?: number;
  maxAmount?: number;
  interestRate?: number;
  interestType?: 'Flat' | 'Reducing' | 'Compound';
  repaymentPeriodMin?: number; // months
  repaymentPeriodMax?: number; // months
  processingFee?: number;
  penaltyRate?: number;
  creditLimit?: number;
  annualFee?: number;
  lateFee?: number;
  minBalance?: number;
  maintenanceFee?: number;
}

export interface ProductEligibility {
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  employmentTypes?: string[];
  documents?: string[];
  creditScoreRange?: [number, number];
}

export interface ProductOrgAssignment {
  orgId: string;
  orgName: string;
  overrideInterestRate?: number;
  overrideFee?: number;
  isAvailable: boolean;
}

export interface ProductCompliance {
  regulatoryCategory: string;
  riskRating: 'Low' | 'Medium' | 'High';
  countries: string[];
  autoApproval: boolean;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  type: ProductType;
  description: string;
  status: Status;
  version: number;
  createdDate: string;
  financialRules: ProductFinancialRules;
  eligibility: ProductEligibility;
  assignedOrgs: ProductOrgAssignment[];
  compliance: ProductCompliance;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondaryValue?: number;
  [key: string]: any;
}