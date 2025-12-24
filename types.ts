
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
  descLines: string[];
  categories: Category[];
  installment: InstallmentPlan;
  isAvailable: boolean;
  notes: string;
  noteLines: string[];
  requiredPapers: string[];
  createdAt: number;
  images: string[]; // Updated to array of Base64 strings
}

export interface GlobalSettings {
  brands: string[];
  documents: string[];
}

export type View = 'models' | 'loanCalc' | 'priceAnalysis' | 'documents' | 'installments' | 'comparison' | 'upload';
