
import React, { useState } from 'react';
import { Calculator, Plus, Save, Download, RefreshCw, FileText, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Language, ProcurementPlan } from '../types';
import FormModal from '../components/FormModal';

const ProcurementPlanView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const initialItems = [
    '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
    '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
    '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
    '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
  ];

  const generateInitialPlans = (): ProcurementPlan[] => {
    return initialItems.map((name, i) => ({
      id: `PLAN-2026-${(i + 1).toString().padStart(3, '0')}`,
      drawingNo: `DWG-${300 + i}`,
      name: name,
      unit: i % 5 === 0 ? '套 (Set)' : '件 (Pcs)',
      quantity: 100 + (i * 50),
      source: i % 4 === 0 ? 'Auto' : 'Manual',
      status: i % 3 === 0 ? 'Approved' : 'Draft'
    }));
  };

  const [plans, setPlans] = useState<ProcurementPlan[]>(generateInitialPlans());
  const [isCalculating, setIsCalculating] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ProcurementPlan>>({});

  // 模拟调用后端 Node.js 接口进行库存对冲分析
  const handleAutoGenerate = () => {
    setIsCalculating(true);
    // 模拟后端算法检索 MySQL 储备定额与实时库存的耗时
    setTimeout(() => {
      setIsCalculating(false);
      const autoPlan: ProcurementPlan = {
        id: `PLAN-26-AUTO-${Math.floor(Math.random() * 1000)}`,
        drawingNo: 'DWG-REGEN-' + Math.floor(Math.random() * 999),
        name: t('缺口补齐部件', 'Gap Replenishment Part'),
        unit: 'Pcs',
        quantity: Math.floor(Math.random() * 500) + 50,
        source: 'Auto',
        status: 'Draft'
      };
      setPlans([autoPlan, ...plans]);
    }, 1200);
  };

  const handleManualAdd = () => {
    const newPlan = {
      ...formData,
      id: `PLAN-2026-M${(plans.length + 1).toString().padStart(3, '0')}`,
      source: 'Manual',
      status: 'Draft'
    } as ProcurementPlan;
    setPlans([newPlan, ...plans]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部决策支持区 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
            <FileText size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{t('采购计划流转中心', 'Procurement Planning Hub')}</h4>
            <p className="text-xs text-slate-400 mt-1">{t(`系统监控中：当前 ${plans.length} 项物料存在采购需求`, `System Active: ${plans.length} items requiring procurement`)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAutoGenerate} 
            disabled={isCalculating} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isCalculating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
            }`}
          >
            {isCalculating ? <RefreshCw className="animate-spin" size={18} /> : <Calculator size={18} />}
            {t('计算库存缺口', 'Analyze Stock Gap')}
          </button>
          <button 
            onClick={() => setModalOpen(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all"
          >
            <Plus size={18} /> {t('手工补录', 'Manual Entry')}
          </button>
        </div>
      </div>

      {/* 计划数据网格 */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('计划单号', 'Plan ID')}</th>
                <th className="px-6 py-5">{t('图号 / 部件', 'DWG No / Part')}</th>
                <th className="px-6 py-5 text-center">{t('单位', 'Unit')}</th>
                <th className="px-6 py-5 text-center">{t('建议采购量', 'Target Qty')}</th>
                <th className="px-6 py-5">{t('计划来源', 'Source')}</th>
                <th className="px-6 py-5">{t('流程状态', 'Process Status')}</th>
                <th className="px-6 py-5 text-center">{t('指令', 'Command')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{p.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{p.drawingNo}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-500 font-medium">{p.unit}</td>
                  <td className="px-6 py-4 text-sm text-center font-black text-blue-600 bg-blue-50/30">
                    {p.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                      p.source === 'Auto' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 ${
                      p.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status === 'Approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-300 hover:text-blue-600 transition-colors"><Save size={16} /></button>
                      <button onClick={() => setPlans(plans.filter(item => item.id !== p.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 手工录入模态框 */}
      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('手工录入采购计划', 'Manual Plan Entry')} onConfirm={handleManualAdd} lang={lang}>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('图号标识', 'Drawing Identifier')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. DWG-2026-X" onChange={e => setFormData({...formData, drawingNo: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('物料名称', 'Part Name')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('输入部件名称', 'Enter Part Name')} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('单位', 'Unit')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Pcs / Set" onChange={e => setFormData({...formData, unit: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('计划数量', 'Planning Quantity')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" type="number" placeholder="0" onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default ProcurementPlanView;
