
import React, { useState, useMemo } from 'react';
import { 
  Truck, Search, Download, CheckCircle2, 
  AlertCircle, Clock, Filter, PackageOpen, 
  ArrowRight, BarChart3, CalendarClock 
} from 'lucide-react';
import { Language, SupplyNotice } from '../types';

const SupplyNoticeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialNotices = (): SupplyNotice[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    
    return parts.map((name, i) => {
      const total = 500 + (i * 100);
      const supplied = Math.floor(Math.random() * total);
      const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
      const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');
      const dateStr = `2026-${month}-${day}`;
      
      return {
        id: `NOTICE-SN-${(1000 + i)}`,
        supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
        itemName: name,
        specs: i % 3 === 0 ? 'Grade A' : 'Standard',
        totalQty: total,
        suppliedQty: supplied,
        remainingQty: total - supplied,
        unitPrice: 50 + (i * 10),
        estCompletionDate: dateStr,
        status: supplied === total ? 'Completed' : (i % 7 === 0 ? 'Delayed' : 'In-Progress')
      };
    });
  };

  const [notices] = useState<SupplyNotice[]>(generateInitialNotices());
  const [searchTerm, setSearchTerm] = useState('');

  // 核心业务指标 (模拟后端聚合统计)
  const kpis = useMemo(() => {
    const totalItems = notices.length;
    const completedItems = notices.filter(n => n.status === 'Completed').length;
    const delayedItems = notices.filter(n => n.status === 'Delayed').length;
    const totalRemaining = notices.reduce((acc, curr) => acc + curr.remainingQty, 0);
    return { totalItems, completedItems, delayedItems, totalRemaining };
  }, [notices]);

  const filteredNotices = notices.filter(n => 
    n.supplierName.includes(searchTerm) || n.itemName.includes(searchTerm) || n.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部物流交付监控看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('执行中通知单', 'Active Notices')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{kpis.totalItems - kpis.completedItems}</h4>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={18} /></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">{t('包含', 'Includes')} {kpis.completedItems} {t('项已完结记录', 'completed entries')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('全线累计欠交量', 'Total Backlog Qty')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-blue-600">{kpis.totalRemaining.toLocaleString()}</h4>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><PackageOpen size={18} /></div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('逾期风险警告', 'Overdue Risk')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-rose-600">{kpis.delayedItems}</h4>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={18} /></div>
          </div>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse">{t('需立即联系供应商催办', 'Action Required: Supplier Follow-up')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('平均交付周期', 'Avg. Lead Time')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">12.5 <span className="text-xs font-normal text-slate-400">Days</span></h4>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CalendarClock size={18} /></div>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold tracking-tight">↑ {t('效率提升 4.2%', 'Efficiency up 4.2%')}</p>
        </div>
      </div>

      {/* 列表控制区 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('搜索单号、厂商或物料名称...', 'Search ID, Vendor, or Part...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('高级过滤', 'Filter')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200">
            <Truck size={18} /> {t('编制供货单', 'New Notice')}
          </button>
        </div>
      </div>

      {/* 供货明细表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('通知单号 / 厂商', 'Notice ID / Vendor')}</th>
                <th className="px-6 py-5">{t('部件与规格', 'Item & Specs')}</th>
                <th className="px-6 py-5 text-center">{t('计划总量', 'Planned')}</th>
                <th className="px-6 py-5 text-center">{t('交付详情 (供/欠)', 'Delivered / Remaining')}</th>
                <th className="px-6 py-5 text-center">{t('交付进度', 'Progress')}</th>
                <th className="px-6 py-5 text-center">{t('预计完工', 'ETA')}</th>
                <th className="px-6 py-5 text-center">{t('状态', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.map((n) => {
                const percent = Math.round((n.suppliedQty / n.totalQty) * 100);
                return (
                  <tr key={n.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-slate-900 font-mono">{n.id}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-1">{n.supplierName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-800">{n.itemName}</div>
                      <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">{n.specs}</div>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-slate-500">{n.totalQty}</td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-black text-emerald-600">{n.suppliedQty}</span>
                        <ArrowRight size={10} className="text-slate-300" />
                        <span className={`text-sm font-black ${n.remainingQty > 0 ? 'text-rose-600' : 'text-slate-300'}`}>
                          {n.remainingQty}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-black ${percent === 100 ? 'text-emerald-600' : 'text-blue-500'}`}>{percent}%</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${percent === 100 ? 'bg-emerald-500' : (n.status === 'Delayed' ? 'bg-rose-500' : 'bg-blue-500')}`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-[11px] font-mono font-bold text-slate-500 italic">
                      {n.estCompletionDate}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 shadow-sm border ${
                        n.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        n.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' : 
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {n.status === 'Completed' ? <CheckCircle2 size={10} /> : n.status === 'Delayed' ? <AlertCircle size={10} /> : <Clock size={10} />}
                        {n.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplyNoticeView;
