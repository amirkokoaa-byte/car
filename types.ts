
export type Theme = 'glass' | 'win10' | 'ios' | 'dark';

export interface Category {
  id: string;
  name: string;
  price: number;
}

export interface InstallmentPlan {
  basePrice: number;
  downPayment: number;
  interestRate: number;
  years: number;
  monthlyInstallment: number;
}

export interface Car {
  id: string;
  brand: string;
  year: number;
  name: string;
  description: string;
  descLines: string[]; // 8 initial, expandable to 28
  categories: Category[];
  installment: InstallmentPlan;
  isAvailable: boolean;
  notes: string;
  noteLines: string[]; // 5 lines
  requiredPapers: string[]; // 10 lines
  createdAt: number;
}

export interface GlobalSettings {
  brands: string[];
  documents: string[]; // Global documents list (10 items)
}

export type View = 'models' | 'loanCalc' | 'priceAnalysis' | 'documents' | 'installments' | 'comparison';
