
import React, { useState } from 'react';
import { AlertTriangle, Trash2, RotateCcw, Truck, Search } from 'lucide-react';
import { Language, DefectNotice } from '../types';

const DefectNoticeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialDefects = (): DefectNotice[] => {
    const parts = [
      '轴承 Z-9', '主控芯片 IC-10', '微型马达 MT-5', '高压管路 HP-8'
    ];
    const reasons = ['关键尺寸超差', '材料成分不达标', '功能测试失效', '严重形变'];
    return parts.map((name, i) => ({
      id: `DEF-2026-${(500 + i)}`,
      inspectId: `INS-2026-${(200 + i * 5)}`,
      itemName: name,
      failReason: reasons[i % reasons.length],
      disposal: i % 2 === 0 ? 'Return' : 'Scrap',
      handler: '李高级工程师',
      date: `2026-02-${(i % 5) + 15}`
    }));
  };

  const [defects] = useState<DefectNotice[]>(generateInitialDefects());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-rose-600" />
            {t('不合格处理通知单 (4)', 'Defect Disposal Notices (4)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('处理严重质量问题的正式单据', 'Official documents for handling critical defects')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">{t('处理单号', 'Defect ID')}</th>
              <th className="px-6 py-4">{t('部件名称', 'Item Name')}</th>
              <th className="px-6 py-4">{t('不合格原因', 'Reason')}</th>
              <th className="px-6 py-4 text-center">{t('处理方式', 'Disposal')}</th>
              <th className="px-6 py-4 text-center">{t('负责人', 'Handler')}</th>
              <th className="px-6 py-4 text-center">{t('日期', 'Date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {defects.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{d.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{d.inspectId}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{d.itemName}</td>
                <td className="px-6 py-4 text-sm text-rose-600 font-medium">{d.failReason}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 mx-auto max-w-[80px] ${
                    d.disposal === 'Return' ? 'bg-orange-100 text-orange-700' : 
                    d.disposal === 'Scrap' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {d.disposal === 'Return' ? <RotateCcw size={10} /> : <Trash2 size={10} />}
                    {d.disposal}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">{d.handler}</td>
                <td className="px-6 py-4 text-center text-sm text-slate-500 font-mono">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectNoticeView;
