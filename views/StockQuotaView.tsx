
import React, { useState } from 'react';
import { Database, TrendingUp, AlertCircle, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Language, StockQuota } from '../types';
import FormModal from '../components/FormModal';

const StockQuotaView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialQuotas = (): StockQuota[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9', 
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1'
    ];
    return parts.map((name, i) => ({
      id: `Q${(i + 1).toString().padStart(3, '0')}`,
      partName: name,
      drawingNo: `DWG-${100 + i}`,
      reserveQuota: 500 + (i * 100),
      highQuota: 1000 + (i * 200),
      lowQuota: 100 + (i * 20),
      currentStock: Math.floor(Math.random() * 1500)
    }));
  };

  const [quotas, setQuotas] = useState<StockQuota[]>(generateInitialQuotas());
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockQuota>>({});

  const handleAdd = () => {
    const newQuota = {
      ...formData,
      id: `Q${(quotas.length + 1).toString().padStart(3, '0')}`
    } as StockQuota;
    setQuotas([...quotas, newQuota]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center gap-4">
          <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200"><AlertCircle size={24} /></div>
          <div>
            <p className="text-rose-600 text-xs font-bold uppercase tracking-wider">{t('低库存预警', 'Low Stock')}</p>
            <h4 className="text-2xl font-bold text-slate-800">{quotas.filter(q => q.currentStock < q.lowQuota).length} {t('项', 'Items')}</h4>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200"><TrendingUp size={24} /></div>
          <div>
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{t('高库存预警', 'High Stock')}</p>
            <h4 className="text-2xl font-bold text-slate-800">{quotas.filter(q => q.currentStock > q.highQuota).length} {t('项', 'Items')}</h4>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200"><Database size={24} /></div>
          <div>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">{t('总SKU', 'Total SKUs')}</p>
            <h4 className="text-2xl font-bold text-slate-800">{quotas.length}</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">{t('储备定额定义表 (15)', 'Stock Quota Setup (15)')}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setModalOpen(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> {t('新增定额', 'New Quota')}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('部件名称', 'Part Name')}</th>
                <th className="px-6 py-4">{t('图号', 'DWG No')}</th>
                <th className="px-6 py-4 text-center">{t('低储', 'Low')}</th>
                <th className="px-6 py-4 text-center">{t('储备', 'Quota')}</th>
                <th className="px-6 py-4 text-center">{t('高储', 'High')}</th>
                <th className="px-6 py-4 text-center">{t('当前', 'Current')}</th>
                <th className="px-6 py-4 text-center">{t('预警', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotas.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{q.partName}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{q.drawingNo}</td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">{q.lowQuota}</td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-800">{q.reserveQuota}</td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">{q.highQuota}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className={`font-bold ${q.currentStock < q.lowQuota ? 'text-rose-600' : q.currentStock > q.highQuota ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {q.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {q.currentStock < q.lowQuota ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">{t('不足', 'Short')}</span>
                      ) : q.currentStock > q.highQuota ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">{t('积压', 'Excess')}</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{t('正常', 'Good')}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('新增储备定额', 'Add Stock Quota')} onConfirm={handleAdd} lang={lang}>
        <div className="grid grid-cols-2 gap-4">
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('部件名称', 'Part Name')} onChange={e => setFormData({...formData, partName: e.target.value})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('图号', 'DWG No')} onChange={e => setFormData({...formData, drawingNo: e.target.value})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" type="number" placeholder={t('低储', 'Low')} onChange={e => setFormData({...formData, lowQuota: parseInt(e.target.value)})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" type="number" placeholder={t('高储', 'High')} onChange={e => setFormData({...formData, highQuota: parseInt(e.target.value)})} />
        </div>
      </FormModal>
    </div>
  );
};

export default StockQuotaView;
