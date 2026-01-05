
import React, { useState } from 'react';
import { Truck, Search, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Language, SupplyNotice } from '../types';

const SupplyNoticeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

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
      return {
        id: `NOTICE-SN-${(1000 + i)}`,
        supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
        itemName: name,
        specs: i % 3 === 0 ? 'Grade A' : 'Standard',
        totalQty: total,
        suppliedQty: supplied,
        remainingQty: total - supplied,
        unitPrice: 50 + (i * 10),
        estCompletionDate: `2024-01-${(i % 28) + 1}`,
        status: supplied === total ? 'Completed' : (i % 7 === 0 ? 'Delayed' : 'In-Progress')
      };
    });
  };

  const [notices] = useState<SupplyNotice[]>(generateInitialNotices());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-blue-600" />
            {t('供货计划通知单 (21)', 'Supply Notice Tracker (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('实时监控厂商到货情况与欠交明细', 'Real-time monitoring of arrival status and backlogs')}</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all">+ {t('编制通知单', 'Create Notice')}</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[650px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('厂商/部件', 'Vendor / Item')}</th>
                <th className="px-6 py-4 text-center">{t('计划总量', 'Total')}</th>
                <th className="px-6 py-4 text-center">{t('已供货', 'Supplied')}</th>
                <th className="px-6 py-4 text-center">{t('欠交', 'Remaining')}</th>
                <th className="px-6 py-4 text-center">{t('预计完工', 'Est. Completion')}</th>
                <th className="px-6 py-4 text-center">{t('供货进度', 'Progress')}</th>
                <th className="px-6 py-4 text-center">{t('状态', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.map((n) => {
                const percent = Math.round((n.suppliedQty / n.totalQty) * 100);
                return (
                  <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{n.supplierName}</div>
                      <div className="text-xs text-slate-500">{n.itemName} ({n.specs})</div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{n.totalQty}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-emerald-600">{n.suppliedQty}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-rose-600">{n.remainingQty}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500 font-mono">{n.estCompletionDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400">{percent}%</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${percent === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        n.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        n.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
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
