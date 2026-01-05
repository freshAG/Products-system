
import React, { useState } from 'react';
import { ShieldCheck, Search, Download, ClipboardCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language, InspectionRequest } from '../types';

const InspectionRequestView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialRequests = (): InspectionRequest[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => ({
      id: `INS-2026-${(200 + i)}`,
      noticeId: `NOTICE-SN-${(1000 + i)}`,
      supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
      itemName: name,
      batchNo: `BAT-${2026}${Math.floor(Math.random()*9000)+1000}`,
      requestQty: 100 + (i * 10),
      requestDate: `2026-01-${(i % 28) + 1}`,
      inspector: i % 3 === 0 ? '张工' : '李工',
      status: i % 10 === 0 ? 'Unqualified' : (i % 5 === 0 ? 'Pending' : 'Qualified')
    }));
  };

  const [requests] = useState<InspectionRequest[]>(generateInitialRequests());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-emerald-600" />
            {t('产品请检单 (21)', 'Inspection Requests (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('到货产品入库前强制检验流程', 'Mandatory inspection process before storage')}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50"><Download size={18} /></button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all">+ {t('新建请检单', 'New Request')}</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('请检单号/通知单', 'Request ID / Notice')}</th>
                <th className="px-6 py-4">{t('厂商/部件', 'Vendor / Item')}</th>
                <th className="px-6 py-4 text-center">{t('批次号', 'Batch No')}</th>
                <th className="px-6 py-4 text-center">{t('报检数', 'Req Qty')}</th>
                <th className="px-6 py-4 text-center">{t('报检日期', 'Date')}</th>
                <th className="px-6 py-4 text-center">{t('状态', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{r.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.noticeId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{r.supplierName}</div>
                    <div className="text-xs text-slate-500">{r.itemName}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-mono text-slate-600">{r.batchNo}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{r.requestQty}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500 font-mono">{r.requestDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      r.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' : 
                      r.status === 'Unqualified' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status === 'Qualified' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                      {r.status}
                    </span>
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

export default InspectionRequestView;
