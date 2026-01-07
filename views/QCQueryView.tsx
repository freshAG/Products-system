
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Search, Filter, Download, ShieldCheck, 
  ShieldAlert, ShieldQuestion, CheckCircle2, XCircle, AlertCircle, TrendingUp,
  FileSearch, History, Users2, CalendarRange, ArrowUpRight
} from 'lucide-react';
import { Language } from '../types';

interface QCRecord {
  id: string;
  batchNo: string;
  supplier: string;
  itemName: string;
  inspectQty: number;
  passQty: number;
  failQty: number;
  passRate: number;
  inspector: string;
  date: string;
  result: 'Pass' | 'Fail' | 'Conditional';
  followUp: string;
}

const QCQueryView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const mockData = useMemo((): QCRecord[] => {
    const parts = [
      '轴承 Z-9', '主控芯片 IC-10', '微型马达 MT-5', '高压管路 HP-8', 
      '齿轮 A-12', '控制板 V-2', '传感器 C-0', '液压泵 H-5', '法兰盘 F-2',
      '密封圈 S-88', '传动轴 B-05', '连接销 P-1', '散热器 R-4', '阀门 G-6'
    ];
    return parts.map((name, i) => {
      const inspectQty = 100 + (i * 20);
      let result: 'Pass' | 'Fail' | 'Conditional' = 'Pass';
      if (i % 12 === 0) result = 'Fail';
      else if (i % 8 === 0) result = 'Conditional';

      const failQty = result === 'Pass' ? 0 : (result === 'Fail' ? Math.floor(inspectQty * 0.15) : Math.floor(inspectQty * 0.03));
      const passQty = inspectQty - failQty;
      const passRate = (passQty / inspectQty) * 100;

      return {
        id: `QC-${2026}${100 + i}`,
        batchNo: `BAT-${2026}02-${(i + 1).toString().padStart(2, '0')}`,
        supplier: i % 2 === 0 ? '正奇机械有限公司' : 'Alpha Electronic Ltd',
        itemName: name,
        inspectQty,
        passQty,
        failQty,
        passRate,
        inspector: i % 3 === 0 ? '张工' : (i % 3 === 1 ? '李工' : '赵工'),
        date: `2026-02-${(i % 20) + 1}`.padStart(10, '0'),
        result,
        followUp: result === 'Pass' ? t('准予入库', 'Approved to Store') : (result === 'Fail' ? t('拒收并退货', 'Returned') : t('特采使用/限期整改', 'Rectification'))
      };
    });
  }, [lang]);

  const stats = useMemo(() => {
    const total = mockData.length;
    const passed = mockData.filter(d => d.result === 'Pass').length;
    const failed = mockData.filter(d => d.result === 'Fail').length;
    const conditional = mockData.filter(d => d.result === 'Conditional').length;
    const avgPassRate = mockData.reduce((acc, curr) => acc + curr.passRate, 0) / total;
    return { total, passed, failed, conditional, avgPassRate };
  }, [mockData]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockData.filter(d => 
    d.itemName.includes(searchTerm) || 
    d.supplier.includes(searchTerm) || 
    d.batchNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部质量大数据看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('累计质量检验单', 'Total QC Records')}</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileSearch size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.total} <span className="text-xs font-normal text-slate-400">份</span></h4>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp size={12} /> +3.2% {t('较上周', 'vs Last Week')}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('全厂综合合格率', 'Overall Pass Rate')}</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><ShieldCheck size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-emerald-600">{stats.avgPassRate.toFixed(1)}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.avgPassRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('高危不合格批次', 'High Risk Failures')}</p>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors"><ShieldAlert size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">{stats.failed} <span className="text-xs font-normal text-slate-400">批</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse">{t('已触发不合格处理流程', 'CAPA Process Triggered')}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><History className="text-white" size={40} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('数据同步状态', 'Sync Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('实时 (Real-time)', 'Real-time')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('已连接 MySQL 主数据库', 'Connected to Primary DB')}</p>
        </div>
      </div>

      {/* 控制中心 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('快速搜索批次、厂商、物料关键字...', 'Search Batch, Vendor, or Part...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <CalendarRange size={18} /> {t('日期范围', 'Date Range')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('更多筛选', 'Filters')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200">
            <Download size={18} /> {t('导出分析报表', 'Export Analytics')}
          </button>
        </div>
      </div>

      {/* 质检数据网格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('检验批次 / 供应商', 'Batch / Supplier')}</th>
                <th className="px-6 py-5">{t('质检部件信息', 'Part Information')}</th>
                <th className="px-6 py-5 text-center">{t('抽检明细 (实测/合格)', 'Sample Details')}</th>
                <th className="px-6 py-5 text-center">{t('合格率', 'Pass Rate')}</th>
                <th className="px-6 py-5 text-center">{t('判定结果', 'Final Verdict')}</th>
                <th className="px-6 py-5">{t('执行后续处理建议', 'Follow-up Action')}</th>
                <th className="px-6 py-5 text-center">{t('日期/人员', 'Date/By')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-900 font-mono tracking-tight">{record.batchNo}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter truncate max-w-[150px]">{record.supplier}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{record.itemName}</div>
                    <div className="text-[9px] text-blue-500 font-bold mt-1 uppercase tracking-widest">{record.id}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-black text-slate-800">{record.inspectQty}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded font-black">OK:{record.passQty}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${record.failQty > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-300'}`}>NG:{record.failQty}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[11px] font-black ${record.passRate === 100 ? 'text-emerald-600' : (record.passRate < 90 ? 'text-rose-600' : 'text-amber-600')}`}>
                        {record.passRate.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${record.passRate > 95 ? 'bg-emerald-500' : (record.passRate > 80 ? 'bg-amber-500' : 'bg-rose-500')}`} style={{ width: `${record.passRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 shadow-sm border ${
                      record.result === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      record.result === 'Fail' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {record.result === 'Pass' ? <CheckCircle2 size={10} /> : record.result === 'Fail' ? <XCircle size={10} /> : <ShieldQuestion size={10} />}
                      {record.result}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-lg ${record.result === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          <ArrowUpRight size={14} />
                       </div>
                       <p className="text-[11px] font-bold text-slate-600 leading-tight">
                        {record.followUp}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Users2 size={12} className="text-slate-400" />
                        {record.inspector}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 italic">{record.date}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部审计声明 */}
      <div className="p-6 bg-white rounded-[2rem] border border-slate-200 border-dashed text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
          <AlertCircle size={18} />
          <span className="text-xs font-black uppercase tracking-widest">{t('质检数据溯源说明', 'QC Data Traceability')}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          {t('本查询模块所有数据均实时同步自 MySQL 生产库，任何对历史判定结果的修改均会被 Node.js 审计日志模块记录。导出的分析报表具有质量管理体系法律效力。', 'All data is synced real-time from MySQL. Any modifications to historical verdicts are recorded in Node.js audit logs. Exported reports carry QMS legal validity.')}
        </p>
      </div>
    </div>
  );
};

export default QCQueryView;
