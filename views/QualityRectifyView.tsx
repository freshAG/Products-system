
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Search, FileEdit, CheckSquare, Clock, 
  Filter, Download, AlertTriangle, CheckCircle2, 
  ArrowRight, ShieldCheck, History, CalendarDays
} from 'lucide-react';
import { Language, QualityRectification } from '../types';

const QualityRectifyView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialRectifies = (): QualityRectification[] => {
    const issues = [
      '包装轻微破损，不影响内部零件', '标签字迹模糊', '表面防护漆不均匀', 
      '尺寸偏差在临界范围', '缺少合格证明文件', '防锈油涂抹不足', 
      '批次标识与实物不符', '紧固件扭矩未达标', '焊缝处有细微气孔'
    ];
    return Array.from({ length: 15 }, (_, i) => ({
      id: `RECT-2026-${(300 + i)}`,
      inspectId: `INS-2026-${(200 + i)}`,
      supplierName: i % 2 === 0 ? `正奇机械 ${(i % 5 + 1)} 厂` : `Alpha Elec ${(i % 5 + 1)} Ltd`,
      issueDesc: issues[i % issues.length],
      rectifyPlan: t('限期更换或现场整改，并提交纠正预防措施报告 (CAPA)', 'Replacement or on-site rectification, submit CAPA report'),
      deadline: `2026-02-${(i % 15) + 5}`.padStart(10, '0'),
      status: i % 4 === 0 ? 'Closed' : 'Wait-Confirm'
    }));
  };

  const [rectifies, setRectifies] = useState<QualityRectification[]>(generateInitialRectifies());
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟后端聚合查询看板数据
  const stats = useMemo(() => {
    const total = rectifies.length;
    const waiting = rectifies.filter(r => r.status === 'Wait-Confirm').length;
    const closed = rectifies.filter(r => r.status === 'Closed').length;
    const completionRate = ((closed / total) * 100).toFixed(1);
    return { total, waiting, closed, completionRate };
  }, [rectifies]);

  const filteredRectifies = rectifies.filter(r => 
    r.supplierName.includes(searchTerm) || r.id.includes(searchTerm) || r.issueDesc.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部质量闭环看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('累计整改项', 'Total Actions')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all"><History size={18} /></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">{t('包含历史已结案项', 'Incl. historical closed')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('待现场确认', 'Waiting Confirmation')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-amber-600">{stats.waiting}</h4>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all"><Clock size={18} /></div>
          </div>
          <p className="text-[10px] text-amber-500 mt-2 font-bold animate-pulse">{t('需指派质检员验证', 'Assign QC for verification')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('整改闭环率', 'Closed-loop Rate')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-emerald-600">{stats.completionRate}%</h4>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all"><ShieldCheck size={18} /></div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><AlertTriangle className="text-white" size={40} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('系统状态', 'System Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('运行中', 'Nominal')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('CAPA 体系已激活', 'CAPA Active')}</p>
        </div>
      </div>

      {/* 列表控制中心 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('检索单号、供应商、问题关键词...', 'Search ID, Supplier, or Issue...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('多维过滤', 'Filter')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold text-sm transition-all shadow-lg">
            <Download size={18} /> {t('全量导出', 'Export All')}
          </button>
        </div>
      </div>

      {/* 整改任务网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRectifies.map((rect) => (
          <div key={rect.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col">
            {/* 状态指示边条 */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${rect.status === 'Closed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <FileEdit size={10} /> {rect.id}
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">{rect.supplierName}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border ${
                rect.status === 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {rect.status === 'Closed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                {rect.status}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter mb-1">{t('不合格事实', 'Non-conformity')}</p>
                <p className="text-sm text-slate-600 font-medium italic">"{rect.issueDesc}"</p>
                <div className="absolute right-3 top-3 opacity-20"><ShieldAlert size={20} className="text-rose-500" /></div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t('整改执行方案', 'Action Plan')}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{rect.rectifyPlan}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays size={14} />
                  <span className="text-[11px] font-bold">{t('截止日期', 'Deadline')}</span>
                </div>
                <span className="text-[11px] font-black font-mono text-slate-900">{rect.deadline}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                <History size={12} /> {rect.inspectId}
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
                {rect.status === 'Wait-Confirm' && (
                  <button 
                    onClick={() => {
                      setRectifies(rectifies.map(r => r.id === rect.id ? {...r, status: 'Closed'} : r))
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <CheckSquare size={12} /> {t('现场确认', 'Confirm')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部引导 */}
      <div className="p-6 bg-white rounded-[2rem] border border-slate-200 border-dashed text-center">
        <p className="text-sm text-slate-400 font-medium italic">
          {t('所有整改确认必须上传实物对比照片及 CAPA 报告，系统将自动留存 5 年以备外部审计。', 'All confirmations require photo evidence and CAPA reports, retained for 5 years for external audit.')}
        </p>
      </div>
    </div>
  );
};

export default QualityRectifyView;
