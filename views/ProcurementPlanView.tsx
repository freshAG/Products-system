
import React, { useState } from 'react';
import { Calculator, Plus, Save, Download, RefreshCw, FileText, Trash2 } from 'lucide-react';
import { Language, ProcurementPlan } from '../types';
import FormModal from '../components/FormModal';

const ProcurementPlanView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const initialItems = [
    '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
    '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
    '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
    '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
  ];

  const generateInitialPlans = (): ProcurementPlan[] => {
    return initialItems.map((name, i) => ({
      id: `PLAN-${(i + 1).toString().padStart(3, '0')}`,
      drawingNo: `DWG-${300 + i}`,
      name: name,
      unit: i % 5 === 0 ? 'Set' : 'Pcs',
      quantity: 100 + (i * 50),
      source: i % 4 === 0 ? 'Auto' : 'Manual',
      status: i % 3 === 0 ? 'Approved' : 'Draft'
    }));
  };

  const [plans, setPlans] = useState<ProcurementPlan[]>(generateInitialPlans());
  const [isCalculating, setIsCalculating] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ProcurementPlan>>({});

  const handleAutoGenerate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      const autoPlan: ProcurementPlan = {
        id: `PLAN-${(plans.length + 1).toString().padStart(3, '0')}`,
        drawingNo: 'DWG-AUTO-' + Math.floor(Math.random() * 1000),
        name: t('新增自动部件', 'New Auto Part'),
        unit: 'Pcs',
        quantity: 100,
        source: 'Auto',
        status: 'Draft'
      };
      setPlans([autoPlan, ...plans]);
    }, 1000);
  };

  const handleManualAdd = () => {
    const newPlan = {
      ...formData,
      id: `PLAN-${(plans.length + 1).toString().padStart(3, '0')}`,
      source: 'Manual',
      status: 'Draft'
    } as ProcurementPlan;
    setPlans([newPlan, ...plans]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase">{t('采购计划汇总', 'Procurement Overview')}</h4>
            <p className="text-xs text-slate-500">{t(`当前共有 ${plans.length} 项计划物品`, `Currently ${plans.length} items in plan`)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAutoGenerate} disabled={isCalculating} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {isCalculating ? <RefreshCw className="animate-spin" size={18} /> : <Calculator size={18} />}
            {t('重新分析', 'Re-analyze')}
          </button>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">
            <Plus size={18} /> {t('手动添加', 'Add Item')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('图号', 'Drawing No')}</th>
                <th className="px-6 py-4">{t('名称', 'Part Name')}</th>
                <th className="px-6 py-4 text-center">{t('单位', 'Unit')}</th>
                <th className="px-6 py-4 text-center">{t('计划数量', 'Qty')}</th>
                <th className="px-6 py-4">{t('来源', 'Source')}</th>
                <th className="px-6 py-4">{t('状态', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.drawingNo}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-center text-slate-600">{p.unit}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-blue-600">{p.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.source === 'Auto' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {p.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setPlans(plans.filter(item => item.id !== p.id))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('手工录入采购计划', 'Manual Plan Entry')} onConfirm={handleManualAdd} lang={lang}>
        <div className="grid grid-cols-2 gap-4">
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('图号', 'DWG No')} onChange={e => setFormData({...formData, drawingNo: e.target.value})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('部件名称', 'Part Name')} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('单位', 'Unit')} onChange={e => setFormData({...formData, unit: e.target.value})} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" type="number" placeholder={t('数量', 'Quantity')} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
        </div>
      </FormModal>
    </div>
  );
};

export default ProcurementPlanView;
