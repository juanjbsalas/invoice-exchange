export type InvoiceStatus =
  | "draft"
  | "submitted"
  | "confirmed"
  | "funded"
  | "paid"
  | "disputed";

export type UserRole = "farmer" | "store" | "investor" | "admin";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  farmerId: string;
  farmerName: string;
  storeId: string;
  storeName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  fundedDate?: string;
  paidDate?: string;
  status: InvoiceStatus;
  goods: string;
  description?: string;
  yieldRate: number; // annualized %
  platformFee: number; // flat $ fee
  fundedPercent: number; // 0–100
  totalInvestors: number;
}

export interface Investment {
  id: string;
  investorId: string;
  invoiceId: string;
  invoiceNumber: string;
  storeName: string;
  amount: number;
  investedDate: string;
  maturityDate: string;
  yieldRate: number;
  projectedReturn: number;
  actualReturn?: number;
  status: "active" | "matured" | "withdrawn";
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  totalInvoiced: number;
  totalFunded: number;
  invoiceCount: number;
}

export interface GroceryStore {
  id: string;
  name: string;
  chain?: string;
  location: string;
  pendingConfirmations: number;
  totalOwed: number;
}

export interface Investor {
  id: string;
  name: string;
  balance: number;
  totalInvested: number;
  totalEarned: number;
  activeInvestments: number;
}

export interface PlatformStats {
  totalInvoiceVolume: number;
  activeDeals: number;
  capitalDeployed: number;
  totalFeesCollected: number;
  totalInvestors: number;
  totalFarmers: number;
  avgYieldRate: number;
}
