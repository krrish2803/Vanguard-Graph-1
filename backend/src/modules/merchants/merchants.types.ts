export enum MerchantCategory {
  ECOMMERCE = 'ECOMMERCE',
  GAMING = 'GAMING',
  CRYPTO = 'CRYPTO',
  TRAVEL = 'TRAVEL',
  RETAIL = 'RETAIL',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER',
}

export enum MerchantRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Merchant {
  id: string;
  merchantId: string;
  name: string;
  category: MerchantCategory;
  country: string;
  riskLevel: MerchantRiskLevel;
  totalTransactions: number;
  flaggedTransactions: number;
  createdAt: string;
  updatedAt: string;
}

// Computed risk stats — service layer isko derive karta hai
export interface MerchantRiskProfile {
  merchantId: string;
  name: string;
  riskLevel: MerchantRiskLevel;
  totalTransactions: number;
  flaggedTransactions: number;
  flaggedRatio: number;       // flagged / total
}

export interface CreateMerchantInput {
  merchantId: string;
  name: string;
  category: MerchantCategory;
  country: string;
}