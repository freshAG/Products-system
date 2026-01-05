
import React, { useState } from 'react';
import { FileText, Download, Filter, Search, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Language, OrderContract } from '../types';

const OrderContractView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialContracts = (): OrderContract[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => ({
      id: `CTR-2023-${(100 + i)}`,
      planId: `PLAN-${(i + 1).toString().padStart(3, '0')}`,
      supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
      itemName: name,
      totalAmount: 5000 + (i * 2500),
      signDate: `2023-11-${(i % 28) + 1}`,
      status: i % 5 === 0 ? 'Fulfilled' : 'Active'
    }));
  };

  const [contracts, setContracts] = useState<OrderContract[]>(generateInitialContracts());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" />
          {t('产品订货合同管理 (21)', 'Order Contract Management (21)')}
        </h2>
        <div className="flex gap-2">
          <button className="p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50"><Download size={18} /></button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">+ {t('生成新合同', 'Generate Contract')}</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('合同编号', 'Contract ID')}</th>
                <th className="px-6 py-4">{t('厂商/项目', 'Supplier / Item')}</th>
                <th className="px-6 py-4 text-center">{t('合同总额', 'Total Amount')}</th>
                <th className="px-6 py-4 text-center">{t('签订日期', 'Sign Date')}</th>
                <th className="px-6 py-4 text-center">{t('合同状态', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-600">{c.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{c.supplierName}</div>
                    <div className="text-xs text-slate-400">{c.itemName}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600 text-sm">
                    ¥{c.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500">{c.signDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      c.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {c.status === 'Fulfilled' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
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

export default OrderContractView;
