
import React, { useState } from 'react';
import { Calculator, Plus, Save, Download, RefreshCw, FileText, Trash2 } from 'lucide-react';
import { Language, ProcurementPlan } from '../types';
import FormModal from '../components/FormModal';

const ProcurementPlanView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  const [plans, setPlans] = useState<ProcurementPlan[]>([
    { id: 'PLAN-001', drawingNo: 'DWG-992', name: '齿轮 A-12', unit: 'Pcs', quantity: 450, source: 'Auto', status: 'Draft' },
    { id: 'PLAN-002', drawingNo: 'DWG-880', name: '连接销 P-1', unit: 'Pcs', quantity: 200, source: 'Manual', status: 'Approved' },
  ]);

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
        name: t('自动分析生成的部件', 'Auto-analyzed Part'),
        unit: 'Pcs',
        quantity: Math.floor(Math.random() * 500) + 100,
        source: 'Auto',
        status: 'Draft'
      };
      setPlans([autoPlan, ...plans]);
    }, 1500);
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

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{t('计划生成向导', 'Plan Wizard')}</h4>
            <p className="text-xs text-slate-500">{t('根据预测计划、BOM及定额自动生成', 'Auto-generate via forecasts, BOM & quotas')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAutoGenerate}
            disabled={isCalculating}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 font-medium ${isCalculating && 'opacity-70 cursor-wait'}`}
          >
            {isCalculating ? <RefreshCw className="animate-spin" size={18} /> : <Calculator size={18} />}
            {t('自动分析生成', 'Auto Analysis')}
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
          >
            <Plus size={18} />
            {t('手工录入', 'Manual Entry')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">{t('采购计划汇总表', 'Procurement Plan List')}</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Save size={20} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('零部件图号', 'Drawing No')}</th>
                <th className="px-6 py-4">{t('名称', 'Part Name')}</th>
                <th className="px-6 py-4 text-center">{t('单位', 'Unit')}</th>
                <th className="px-6 py-4 text-center">{t('数量', 'Qty')}</th>
                <th className="px-6 py-4">{t('计划来源', 'Source')}</th>
                <th className="px-6 py-4">{t('当前状态', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">{p.drawingNo}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-center text-slate-600">{p.unit}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-slate-900">{p.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.source === 'Auto' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {p.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deletePlan(p.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={t('手工编制采购计划', 'Manual Procurement Planning')}
        onConfirm={handleManualAdd}
        lang={lang}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('图号', 'Drawing No')}</label>
            <input type="text" onChange={e => setFormData({...formData, drawingNo: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('部件名称', 'Part Name')}</label>
            <input type="text" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('单位', 'Unit')}</label>
            <input type="text" onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Pcs, Box" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('需求数量', 'Quantity')}</label>
            <input type="number" onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default ProcurementPlanView;
