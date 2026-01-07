
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
  supplyRatio: number;
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
  status: 'Draft' | 'Approved' | 'Ordered';
}

export interface OrderContract {
  id: string;
  planId: string;
  supplierName: string;
  itemName: string;
  totalAmount: number;
  signDate: string;
  status: 'Active' | 'Fulfilled' | 'Terminated';
}

export interface SupplyNotice {
  id: string;
  supplierName: string;
  itemName: string;
  specs: string;
  totalQty: number;
  suppliedQty: number;
  remainingQty: number;
  unitPrice: number;
  estCompletionDate: string;
  status: 'In-Progress' | 'Completed' | 'Delayed';
}

export interface InspectionRequest {
  id: string;
  noticeId: string;
  supplierName: string;
  itemName: string;
  batchNo: string;
  requestQty: number;
  requestDate: string;
  inspector: string;
  status: 'Pending' | 'Qualified' | 'Unqualified';
}

export interface QualityRectification {
  id: string;
  inspectId: string;
  supplierName: string;
  issueDesc: string;
  rectifyPlan: string;
  deadline: string;
  status: 'Wait-Confirm' | 'Closed';
}

export interface DefectNotice {
  id: string;
  inspectId: string;
  itemName: string;
  failReason: string;
  disposal: 'Return' | 'Scrap' | 'Concession';
  handler: string;
  date: string;
}

export interface DeptExpense {
  id: string;
  date: string;
  department: string;
  category: string;
  description: string;
  amount: number;
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ProductionProgress {
  id: string;
  itemName: string;
  drawingNo: string;
  startDate: string;
  planEndDate: string;
  progress: number;
  stage: 'Planning' | 'Purchasing' | 'Manufacturing' | 'Inspection' | 'Completed';
  status: 'On-track' | 'At-risk' | 'Delayed';
  delayDays: number;
}

export interface QualityParam {
  id: string;
  minScore: number;
  maxScore: number;
  grade: string;
  description: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  category: 'MasterData' | 'Operations' | 'Analysis';
}
