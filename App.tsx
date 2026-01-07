
import React, { useState } from 'react';
import { 
  Menu, X, Globe, LogOut, ChevronRight, Search, Plus, 
  Filter, Download, Bell, User, Calculator, ShoppingCart, Activity
} from 'lucide-react';
import { Language, MenuItem } from './types';
import { MENU_ITEMS, getIcon } from './constants';
import Dashboard from './views/Dashboard';
import SupplierArchive from './views/SupplierArchive';
import StockQuotaView from './views/StockQuotaView';
import ProcurementPlanView from './views/ProcurementPlanView';
import PlanTrackingView from './views/PlanTrackingView';
import CostAnalysisView from './views/CostAnalysisView';
import GeneralTableView from './views/GeneralTableView';
import PurchaserArchive from './views/PurchaserArchive';
import SupplierProducts from './views/SupplierProducts';
import QualityParamsView from './views/QualityParamsView';
import OrderContractView from './views/OrderContractView';
import SupplyNoticeView from './views/SupplyNoticeView';
import InspectionRequestView from './views/InspectionRequestView';
import QualityRectifyView from './views/QualityRectifyView';
import DefectNoticeView from './views/DefectNoticeView';
import DeptExpensesView from './views/DeptExpensesView';
import QCQueryView from './views/QCQueryView';
import ProdProgressView from './views/ProdProgressView';
import QualityAnalysisView from './views/QualityAnalysisView';
import WorkshopAnalysisView from './views/WorkshopAnalysisView';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard lang={lang} />;
      case 'supplier-archive': return <SupplierArchive lang={lang} />;
      case 'supplier-products': return <SupplierProducts lang={lang} />;
      case 'purchaser-archive': return <PurchaserArchive lang={lang} />;
      case 'stock-quota': return <StockQuotaView lang={lang} />;
      case 'quality-params': return <QualityParamsView lang={lang} />;
      case 'procurement-plan': return <ProcurementPlanView lang={lang} />;
      case 'order-contract': return <OrderContractView lang={lang} />;
      case 'supply-notice': return <SupplyNoticeView lang={lang} />;
      case 'plan-tracking': return <PlanTrackingView lang={lang} />;
      case 'inspection-req': return <InspectionRequestView lang={lang} />;
      case 'quality-rectify': return <QualityRectifyView lang={lang} />;
      case 'defect-notice': return <DefectNoticeView lang={lang} />;
      case 'dept-expenses': return <DeptExpensesView lang={lang} />;
      case 'qc-query': return <QCQueryView lang={lang} />;
      case 'prod-progress': return <ProdProgressView lang={lang} />;
      case 'cost-analysis': return <CostAnalysisView lang={lang} />;
      case 'quality-analysis': return <QualityAnalysisView lang={lang} />;
      case 'workshop-analysis': return <WorkshopAnalysisView lang={lang} />;
      default:
        const currentMenu = MENU_ITEMS.find(m => m.id === activeTab);
        return (
          <GeneralTableView 
            title={currentMenu ? t(currentMenu.label, currentMenu.labelEn) : 'Module'} 
            lang={lang} 
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out z-30 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-white text-base tracking-tight truncate">
              {t('公司采购管理系统', 'PSM Enterprise')}
            </h1>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800'
            }`}
          >
            <Activity size={20} />
            {sidebarOpen && <span>{t('仪表盘', 'Dashboard')}</span>}
          </button>

          {(['MasterData', 'Operations', 'Analysis'] as const).map(cat => (
            <div key={cat} className="space-y-1">
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 opacity-70">
                  {t(
                    cat === 'MasterData' ? '基础数据' : cat === 'Operations' ? '业务操作' : '统计分析',
                    cat === 'MasterData' ? 'Master Data' : cat === 'Operations' ? 'Operations' : 'Analytics'
                  )}
                </p>
              )}
              {MENU_ITEMS.filter(m => m.category === cat).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800'
                  }`}
                  title={!sidebarOpen ? t(item.label, item.labelEn) : ''}
                >
                  {getIcon(item.icon)}
                  {sidebarOpen && <span className="text-sm">{t(item.label, item.labelEn)}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <Globe size={20} />
            {sidebarOpen && <span>{lang === 'zh' ? 'English' : '中文'}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 sticky top-0 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 truncate">
            {activeTab === 'dashboard' ? t('数据总览仪表盘', 'Data Overview Dashboard') : 
             t(MENU_ITEMS.find(m => m.id === activeTab)?.label || '', MENU_ITEMS.find(m => m.id === activeTab)?.labelEn || '')}
          </h2>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative" onClick={() => setNotificationsOpen(!isNotificationsOpen)}>
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{t('系统首席管理员', 'System Chief Admin')}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
