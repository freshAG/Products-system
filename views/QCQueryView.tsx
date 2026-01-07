
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Search, Filter, Download, ShieldCheck, 
  ShieldAlert, ShieldQuestion, CheckCircle2, XCircle, AlertCircle, TrendingUp 
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

  const mockData = useMemo((): QCRecord[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => {
      const inspectQty = 100 + (i * 20);
      let result: 'Pass' | 'Fail' | 'Conditional' = 'Pass';
      if (i % 10 === 0) result = 'Fail';
      else if (i % 7 === 0) result = 'Conditional';

      const failQty = result === 'Pass' ? 0 : (result === 'Fail' ? Math.floor(inspectQty * 0.15) : Math.floor(inspectQty * 0.03));
      const passQty = inspectQty - failQty;
      const passRate = (passQty / inspectQty) * 100;

      return {
        id: `QC-${2026}${100 + i}`,
        batchNo: `BAT-260${i+1}`,
        supplier: i % 2 === 0 ? '正奇机械' : 'Alpha Elec',
        itemName: name,
        inspectQty,
        passQty,
        failQty,
        passRate,
        inspector: i % 3 === 0 ? '张工' : '李工',
        date: `2026-02-${(i % 20) + 1}`.padStart(10, '0'),
        result,
        followUp: result === 'Pass' ? t('直接入库', 'Stored') : (result === 'Fail' ? t('退货处理', 'Returned') : t('特采/整改', 'Rectification'))
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
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('累计检验', 'Total Inspected')}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp size={10} className="text-emerald-500" />
            {t('较上月提升 5%', '+5% from last month')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('平均合格率', 'Avg Pass Rate')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-emerald-600">{stats.avgPassRate.toFixed(1)}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.avgPassRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('不合格批次', 'Defective Batches')}</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldAlert size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">{stats.failed}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('已全部关联不合格处理单', 'All linked to Defect Notices')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('待整改/特采', 'Rectifying')}</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ShieldQuestion size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-amber-600">{stats.conditional}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('需要质量部二次确认', 'QA confirmation required')}</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder={t('搜索批次、供应商或部件...', 'Search Batch, Vendor, Part...')}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border rounded-lg hover:bg-slate-50">
              <Filter size={14} />
              {t('高级筛选', 'Filters')}
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            <Download size={14} />
            {t('导出质检报表', 'Export QC Report')}
          </button>
        </div>

        <div className="overflow-x-auto max-h-[550px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">{t('质检批次/供应商', 'Batch / Supplier')}</th>
                <th className="px-6 py-4">{t('部件名称', 'Part Name')}</th>
                <th className="px-6 py-4 text-center">{t('抽检总数', 'Inspected')}</th>
                <th className="px-6 py-4 text-center">{t('合格率', 'Pass Rate')}</th>
                <th className="px-6 py-4 text-center">{t('判定结果', 'Result')}</th>
                <th className="px-6 py-4">{t('后续处理', 'Follow-up')}</th>
                <th className="px-6 py-4 text-center">{t('日期', 'Date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{record.batchNo}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{record.supplier}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{record.itemName}</div>
                    <div className="text-[10px] text-slate-400">{t('质检员', 'Inspector')}: {record.inspector}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-bold text-slate-800">{record.inspectQty}</div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[10px] text-emerald-600 font-bold">ok:{record.passQty}</span>
                      <span className="text-[10px] text-rose-600 font-bold">ng:{record.failQty}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-[11px] font-black ${record.passRate === 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {record.passRate.toFixed(1)}%
                      </span>
                      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${record.passRate > 95 ? 'bg-emerald-500' : (record.passRate > 80 ? 'bg-amber-500' : 'bg-rose-500')}`} style={{ width: `${record.passRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${
                      record.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 
                      record.result === 'Fail' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.result === 'Pass' ? <CheckCircle2 size={10} /> : record.result === 'Fail' ? <XCircle size={10} /> : <AlertCircle size={10} />}
                      {record.result}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">
                      {record.followUp}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] text-slate-400 font-mono">
                    {record.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QCQueryView;
