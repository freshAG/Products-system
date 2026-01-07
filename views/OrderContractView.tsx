
import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Filter, Search, CheckCircle2, 
  Clock, Trash2, Printer, FileCheck, DollarSign, 
  TrendingUp, ArrowUpRight, XCircle
} from 'lucide-react';
import { Language, OrderContract } from '../types';
import FormModal from '../components/FormModal';

const OrderContractView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialContracts = (): OrderContract[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => {
      const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
      const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');
      return {
        id: `CTR-2026-${(100 + i)}`,
        planId: `PLAN-2026-${(i + 1).toString().padStart(3, '0')}`,
        supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
        itemName: name,
        totalAmount: 58000 + (i * 12500),
        signDate: `2026-${month}-${day}`,
        status: i % 5 === 0 ? 'Fulfilled' : (i % 8 === 0 ? 'Terminated' : 'Active')
      };
    });
  };

  const [contracts, setContracts] = useState<OrderContract[]>(generateInitialContracts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  // 核心财务指标计算 (模拟后端聚合查询)
  const stats = useMemo(() => {
    const total = contracts.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const activeCount = contracts.filter(c => c.status === 'Active').length;
    const fulfilledThisMonth = 12; // 模拟本月已结案数量
    return { total, activeCount, fulfilledThisMonth };
  }, [contracts]);

  const filteredContracts = contracts.filter(c => 
    c.supplierName.includes(searchTerm) || c.id.includes(searchTerm) || c.itemName.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部财务与效能看板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="p-3 bg-blue-600 text-white rounded-2xl w-fit mb-4 shadow-lg shadow-blue-100">
              <DollarSign size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('已签约总额', 'Total Committed Value')}</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">¥{(stats.total / 10000).toFixed(1)}W</h4>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
              <TrendingUp size={12} /> +15.4% {t('较上月', 'vs Last Month')}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="p-3 bg-amber-500 text-white rounded-2xl w-fit mb-4 shadow-lg shadow-amber-100">
              <Clock size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('执行中合同', 'Active Contracts')}</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{stats.activeCount} <span className="text-xs font-normal text-slate-400">/ {contracts.length}</span></h4>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{t('当前履约率保持在 92.5%', 'Current fulfilment rate at 92.5%')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="p-3 bg-emerald-500 text-white rounded-2xl w-fit mb-4 shadow-lg shadow-emerald-100">
              <FileCheck size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('本月已结案', 'Fulfilled This Month')}</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{stats.fulfilledThisMonth} <span className="text-xs font-normal text-slate-400">{t('份单据', 'Docs')}</span></h4>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
              <ArrowUpRight size={12} /> {t('效率提升 8%', 'Efficiency up 8%')}
            </div>
          </div>
        </div>
      </div>

      {/* 合同操作中心 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('搜索合同号、供应商...', 'Search Contract, Supplier...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Download size={18} /> {t('导出清单', 'Export List')}
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200"
          >
            <FileText size={18} /> {t('生成正式合同', 'New Contract')}
          </button>
        </div>
      </div>

      {/* 数据明细表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('合同编号 / 计划关联', 'Contract ID / Plan Ref')}</th>
                <th className="px-6 py-5">{t('供应商 / 签约项目', 'Supplier / Item')}</th>
                <th className="px-6 py-5 text-center">{t('合同总金额', 'Contract Value')}</th>
                <th className="px-6 py-5 text-center">{t('签订时间', 'Signing Date')}</th>
                <th className="px-6 py-5 text-center">{t('执行状态', 'Execution Status')}</th>
                <th className="px-6 py-5 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-900 font-mono tracking-tight">{c.id}</div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <FileText size={10} /> {c.planId}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{c.supplierName}</div>
                    <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">{c.itemName}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm font-black text-blue-600 bg-blue-50/50 py-1 rounded-lg">
                      ¥{c.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-[11px] font-mono font-bold text-slate-500 italic">
                    {c.signDate}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 shadow-sm border ${
                      c.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      c.status === 'Terminated' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {c.status === 'Fulfilled' ? <CheckCircle2 size={10} /> : (c.status === 'Terminated' ? <XCircle size={10} /> : <Clock size={10} />)}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-300 hover:text-blue-600 transition-all hover:scale-110" title={t('打印合同', 'Print')}><Printer size={18} /></button>
                      <button className="text-slate-300 hover:text-rose-500 transition-all hover:scale-110" title={t('注销', 'Terminate')}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('生成订货合同', 'Generate Order Contract')} onConfirm={() => setModalOpen(false)} lang={lang}>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">{t('选择关联的采购计划', 'Select Related Procurement Plan')}</p>
            <select className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">{t('-- 请选择已审批的计划单 --', '-- Select Approved Plan --')}</option>
              <option value="1">PLAN-2026-001 (齿轮 A-12)</option>
              <option value="2">PLAN-2026-002 (传动轴 B-05)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('签约供应商', 'Supplier')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" readOnly value="正奇机械有限公司" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('合同执行状态', 'Status')}</label>
            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('合同备注 / 支付条款', 'Notes / Payment Terms')}</label>
            <textarea className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24" placeholder={t('例如：货到 30 天付清，质保金 5%', 'e.g., Net 30, 5% retention')}></textarea>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default OrderContractView;
