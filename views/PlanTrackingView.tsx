
import React, { useState, useMemo } from 'react';
import { 
  Activity, AlertCircle, CheckCircle2, Clock, 
  ShieldAlert, Search, Filter, Download, 
  ArrowUpRight, PackageSearch, Gauge, BarChart3
} from 'lucide-react';
import { Language } from '../types';

const PlanTrackingView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateTrackingData = () => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => {
      const stock = Math.floor(Math.random() * 500);
      const supply = 1000 + (i * 100);
      const arrival = i % 5 === 0 ? supply : Math.floor(Math.random() * supply);
      const highQuota = supply + 200;
      const lowQuota = 150;
      return {
        id: `TRK-${(i + 1).toString().padStart(3, '0')}`,
        dwg: `DWG-${300 + i}`,
        name: name,
        supplier: i % 2 === 0 ? '正奇机械' : 'Alpha Electronics',
        currentStock: stock,
        lowQuota: lowQuota,
        highQuota: highQuota,
        supplyQty: supply,
        arrivalQty: arrival,
        status: arrival === supply ? 'Received' : (arrival === 0 ? 'Pending' : 'In Transit'),
        quality: i % 12 === 0 ? 'Failed' : 'Qualified'
      };
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const trackingData = useMemo(() => generateTrackingData(), []);

  // 模拟后端聚合统计
  const kpis = useMemo(() => {
    const total = trackingData.length;
    const completed = trackingData.filter(d => d.status === 'Received').length;
    const stockOutRisk = trackingData.filter(d => d.currentStock < d.lowQuota).length;
    const overStockRisk = trackingData.filter(d => (d.currentStock + d.arrivalQty) > d.highQuota).length;
    return { total, completed, stockOutRisk, overStockRisk };
  }, [trackingData]);

  const filteredData = trackingData.filter(d => 
    d.name.includes(searchTerm) || d.supplier.includes(searchTerm) || d.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部执行力看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('计划执行总项', 'Total Tracked')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{kpis.total}</h4>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={18} /></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">{t('已完成', 'Completed')} {kpis.completed}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('缺料风险提示', 'Shortage Risk')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-rose-600">{kpis.stockOutRisk}</h4>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={18} /></div>
          </div>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse">{t('库存低于安全水位', 'Below Safety Limit')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('积压风险预警', 'Overstock Risk')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-amber-600">{kpis.overStockRisk}</h4>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><PackageSearch size={18} /></div>
          </div>
          <p className="text-[10px] text-amber-600 mt-2 font-medium">{t('建议暂缓后续供货', 'Hold Supply Suggested')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('整体达成效率', 'Overall Efficiency')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{Math.round((kpis.completed / kpis.total) * 100)}%</h4>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Gauge size={18} /></div>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold">↑ 4.2% {t('较昨日', 'vs Yesterday')}</p>
        </div>
      </div>

      {/* 控制与搜索区 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('快速检索部件、单号或供应商...', 'Search Part, ID or Supplier...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('多维过滤', 'Multi-Filter')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold text-sm transition-all shadow-lg">
            <Download size={18} /> {t('生成全量报表', 'Full Export')}
          </button>
        </div>
      </div>

      {/* 核心跟踪表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('部件信息 / 溯源码', 'Part Info / ID')}</th>
                <th className="px-6 py-5">{t('供应商名称', 'Supplier')}</th>
                <th className="px-6 py-5 text-center">{t('即时库存', 'Live Stock')}</th>
                <th className="px-6 py-5 text-center">{t('执行进度 (实到/计划)', 'Execution (Arr/Plan)')}</th>
                <th className="px-6 py-5 text-center">{t('到货状态', 'Delivery Status')}</th>
                <th className="px-6 py-5 text-center">{t('质量判定', 'QA Status')}</th>
                <th className="px-6 py-5 text-center">{t('异常干预', 'Intervention')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((row) => {
                const isOverLimit = (row.currentStock + row.arrivalQty) > row.highQuota;
                const isUnderLimit = row.currentStock < row.lowQuota;
                const progress = Math.round((row.arrivalQty / row.supplyQty) * 100);

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-black text-slate-900">{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{row.dwg}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{row.supplier}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-sm font-black ${isUnderLimit ? 'text-rose-600' : 'text-slate-900'}`}>
                        {row.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-black">
                          <span className="text-blue-600">{row.arrivalQty}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-400">{row.supplyQty}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 border ${
                        row.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        row.status === 'Pending' ? 'bg-slate-100 text-slate-500 border-slate-200' : 
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {row.status === 'Received' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 border ${
                        row.quality === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {row.quality === 'Failed' && <ShieldAlert size={10} />}
                        {row.quality}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {isOverLimit ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 animate-pulse">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">{t('高储预警', 'Overload')}</span>
                        </div>
                      ) : isUnderLimit ? (
                        <div className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          <ArrowUpRight size={12} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">{t('缺料风险', 'Shortage')}</span>
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-slate-200 rounded-full mx-auto"></div>
                      )}
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

export default PlanTrackingView;
