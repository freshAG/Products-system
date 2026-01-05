
export type Language = 'zh' | 'en';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  manager: string;
  phone: string;
  zipCode: string;
  fax: string;
  address: string;
  type: string;
  qaSystem: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  drawingNo: string;
  model: string;
  specs: string;
  unitPrice: number;
  supplyRatio: number; // Percentage, e.g., 60 means 60%
}

export interface PurchaserEval {
  id: string;
  param: string;
  score: number;
  comment: string;
  date: string;
}

export interface Purchaser {
  id: string;
  name: string;
  phone: string;
  address: string;
  rating: number;
  evaluations: PurchaserEval[];
}

export interface StockQuota {
  id: string;
  partName: string;
  drawingNo: string;
  reserveQuota: number;
  highQuota: number;
  lowQuota: number;
  currentStock: number;
}

export interface ProcurementPlan {
  id: string;
  drawingNo: string;
  name: string;
  unit: string;
  quantity: number;
  source: 'Auto' | 'Manual';
  supplierId?: string;
  status: 'Draft' | 'Approved' | 'Ordered';
}

export interface QualityParam {
  id: string;
  minScore: number;
  maxScore: number;
  grade: string;
  description: string;
}

export interface DeptExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
  recorder: string;
  recordDate: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  category: 'MasterData' | 'Operations' | 'Analysis';
}
