
import React from 'react';
import { Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../types';

const PlanTrackingView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const trackingData = [
    { id: 'TRK001', dwg: 'DWG-992', name: '齿轮 A-12', supplier: 'Zhengqi Mech', currentStock: 85, supplyQty: 1000, highQuota: 1000, arrivalQty: 0, status: 'In Transit', quality: 'Pending' },
    { id: 'TRK002', dwg: 'DWG-102', name: '传动轴 B-05', supplier: 'Alpha Electron', currentStock: 380, supplyQty: 100, highQuota: 400, arrivalQty: 50, status: 'Partially Received', quality: 'Qualified' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{t('计划跟踪列表', 'Plan Tracking Table')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('部件信息', 'Part Info')}</th>
                <th className="px-6 py-4">{t('厂商', 'Supplier')}</th>
                <th className="px-6 py-4 text-center">{t('现有库存', 'Stock')}</th>
                <th className="px-6 py-4 text-center">{t('供货量', 'Supply Qty')}</th>
                <th className="px-6 py-4 text-center">{t('到货量', 'Arrival Qty')}</th>
                <th className="px-6 py-4">{t('进货/质量', 'Status/Quality')}</th>
                <th className="px-6 py-4">{t('预警', 'Alert')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trackingData.map((row) => {
                const isOverLimit = (row.currentStock + row.supplyQty) > row.highQuota;
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{row.dwg}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.supplier}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{row.currentStock}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{row.supplyQty}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-emerald-600">{row.arrivalQty}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                          {row.status === 'In Transit' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          {row.status}
                        </div>
                        <div className={`text-[10px] font-bold ${row.quality === 'Qualified' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          Quality: {row.quality}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isOverLimit ? (
                        <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full animate-pulse border border-rose-100">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-bold leading-none">{t('超高储！', 'Over Capacity!')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-[10px]">Normal</span>
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
