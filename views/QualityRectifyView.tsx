
import React, { useState } from 'react';
import { ShieldAlert, Search, FileEdit, CheckSquare, Clock } from 'lucide-react';
import { Language, QualityRectification } from '../types';

const QualityRectifyView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialRectifies = (): QualityRectification[] => {
    const issues = [
      '包装轻微破损，不影响内部零件', '标签字迹模糊', '表面防护漆不均匀', '尺寸偏差在临界范围', '缺少合格证明文件'
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      id: `RECT-2026-${(300 + i)}`,
      inspectId: `INS-2026-${(200 + i)}`,
      supplierName: i % 2 === 0 ? '正奇机械' : 'Alpha Elec',
      issueDesc: issues[i % issues.length],
      rectifyPlan: t('限期更换或现场整改', 'Replacement or on-site rectification'),
      deadline: `2026-02-${(i % 15) + 1}`,
      status: i % 4 === 0 ? 'Closed' : 'Wait-Confirm'
    }));
  };

  const [rectifies] = useState<QualityRectification[]>(generateInitialRectifies());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="text-amber-600" />
            {t('质量整改确认 (12)', 'Quality Rectification (12)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('针对轻微不合格项的限期改进流程', 'Improvement process for minor non-conformities')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rectifies.map((rect) => (
          <div key={rect.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${rect.status === 'Closed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rect.id}</span>
                <h4 className="font-bold text-slate-900">{rect.supplierName}</h4>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                rect.status === 'Closed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {rect.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">"{rect.issueDesc}"</p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-slate-400"><Clock size={12} /> {t('截止', 'Due')}: {rect.deadline}</div>
                <div className="flex items-center gap-1 text-slate-400"><FileEdit size={12} /> {rect.inspectId}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end gap-2">
              <button className="text-[11px] font-bold text-blue-600 hover:underline">{t('查看详情', 'View Details')}</button>
              {rect.status === 'Wait-Confirm' && (
                <button className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                  {t('确认关闭', 'Close')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityRectifyView;
