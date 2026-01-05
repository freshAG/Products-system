
import React from 'react';
import { 
  Users, Package, UserCheck, Settings, Database, ClipboardList, 
  FileText, Truck, ShieldCheck, PieChart, Activity, AlertCircle, 
  DollarSign, TrendingUp, ShoppingCart, BarChart3, Factory
} from 'lucide-react';
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'supplier-archive', label: '供应商档案', labelEn: 'Supplier Archive', icon: 'Users', category: 'MasterData' },
  { id: 'supplier-products', label: '产品供应情况', labelEn: 'Supply Details', icon: 'Package', category: 'MasterData' },
  { id: 'purchaser-archive', label: '采购员档案', labelEn: 'Purchaser Archive', icon: 'UserCheck', category: 'MasterData' },
  { id: 'stock-quota', label: '储备定额定义', labelEn: 'Stock Quota', icon: 'Database', category: 'MasterData' },
  { id: 'quality-params', label: '质量评价参数', labelEn: 'Quality Parameters', icon: 'ShieldCheck', category: 'MasterData' },
  
  { id: 'procurement-plan', label: '采购计划表', labelEn: 'Procurement Plan', icon: 'ClipboardList', category: 'Operations' },
  { id: 'order-contract', label: '订货合同', labelEn: 'Order Contract', icon: 'FileText', category: 'Operations' },
  { id: 'supply-notice', label: '供货通知单', labelEn: 'Supply Notice', icon: 'Truck', category: 'Operations' },
  { id: 'plan-tracking', label: '计划跟踪表', labelEn: 'Plan Tracking', icon: 'Activity', category: 'Operations' },
  { id: 'inspection-req', label: '请检单', labelEn: 'Inspection Request', icon: 'ShieldCheck', category: 'Operations' },
  { id: 'dept-expenses', label: '部门费用明细', labelEn: 'Dept Expenses', icon: 'DollarSign', category: 'Operations' },
  { id: 'quality-rectify', label: '质量整改确认', labelEn: 'Quality Rectification', icon: 'AlertCircle', category: 'Operations' },
  { id: 'defect-notice', label: '不合格处理', labelEn: 'Defect Notice', icon: 'AlertCircle', category: 'Operations' },
  
  { id: 'qc-query', label: '质检情况查询', labelEn: 'QC Query', icon: 'BarChart3', category: 'Analysis' },
  { id: 'prod-progress', label: '进度计划分析', labelEn: 'Production Progress', icon: 'TrendingUp', category: 'Analysis' },
  { id: 'cost-analysis', label: '采购成本分析', labelEn: 'Cost Analysis', icon: 'PieChart', category: 'Analysis' },
  { id: 'quality-analysis', label: '质量业绩分析', labelEn: 'Quality Analysis', icon: 'BarChart3', category: 'Analysis' },
  { id: 'workshop-analysis', label: '车间计划分析', labelEn: 'Workshop Analysis', icon: 'Factory', category: 'Analysis' },
];

export const getIcon = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    Users: <Users size={20} />,
    Package: <Package size={20} />,
    UserCheck: <UserCheck size={20} />,
    Settings: <Settings size={20} />,
    Database: <Database size={20} />,
    ClipboardList: <ClipboardList size={20} />,
    FileText: <FileText size={20} />,
    Truck: <Truck size={20} />,
    ShieldCheck: <ShieldCheck size={20} />,
    Activity: <Activity size={20} />,
    DollarSign: <DollarSign size={20} />,
    AlertCircle: <AlertCircle size={20} />,
    BarChart3: <BarChart3 size={20} />,
    TrendingUp: <TrendingUp size={20} />,
    PieChart: <PieChart size={20} />,
    Factory: <Factory size={20} />
  };
  return icons[name] || <FileText size={20} />;
};
