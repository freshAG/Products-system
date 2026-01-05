
import React from 'react';
import { Activity, AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
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
      const arrival = Math.floor(Math.random() * supply);
      const highQuota = supply + 200;
      return {
        id: `TRK-${(i + 1).toString().padStart(3, '0')}`,
        dwg: `DWG-${300 + i}`,
        name: name,
        supplier: i % 2 === 0 ? '正奇机械' : 'Alpha Electronics',
        currentStock: stock,
        supplyQty: supply,
        highQuota: highQuota,
        arrivalQty: arrival,
        status: arrival === supply ? 'Received' : 'In Transit',
        quality: i % 10 === 0 ? 'Failed' : 'Qualified'
      };
    });
  };

  const trackingData = generateTrackingData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
            <Activity className="text-blue-600" />
            {t('全流程计划跟踪表 (21)', 'Full Process Plan Tracking (21)')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{t('实时汇总库存、到货及质量状态', 'Aggregated real-time stock, arrival, and quality data')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('部件信息', 'Part Info')}</th>
                <th className="px-6 py-4">{t('供应商', 'Supplier')}</th>
                <th className="px-6 py-4 text-center">{t('库存', 'Stock')}</th>
                <th className="px-6 py-4 text-center">{t('计划/到货', 'Supply/Arrival')}</th>
                <th className="px-6 py-4 text-center">{t('状态', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('质量', 'Quality')}</th>
                <th className="px-6 py-4 text-center">{t('预警', 'Alert')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trackingData.map((row) => {
                const isOverLimit = (row.currentStock + row.arrivalQty) > row.highQuota;
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{row.dwg}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.supplier}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium">{row.currentStock}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-blue-600">{row.supplyQty}</span>
                        <span className="text-[10px] text-emerald-600">Arrival: {row.arrivalQty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.quality === 'Qualified' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {row.quality === 'Failed' && <ShieldAlert size={10} className="inline mr-1" />}
                        {row.quality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isOverLimit ? (
                        <div className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full animate-pulse border border-rose-100">
                          <AlertCircle size={10} />
                          <span className="text-[9px] font-black">{t('高储！', 'OVER!')}</span>
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto"></div>
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
