
import React, { useState } from 'react';
import { ShieldCheck, Plus, ListFilter, Trash2 } from 'lucide-react';
import { Language } from '../types';
import FormModal from '../components/FormModal';

interface QualityIndicator {
  id: string;
  name: string;
  weight: number;
  criteria: string;
  category: string;
}

const QualityParamsView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const initialParams: QualityIndicator[] = [
    { id: 'Q-01', name: '准时交付率', weight: 30, criteria: '>98% 得满分', category: '交付' },
    { id: 'Q-02', name: '来料合格率', weight: 25, criteria: '>99.5% 得满分', category: '品质' },
    { id: 'Q-03', name: '平均修复时间(MTTR)', weight: 10, criteria: '<4h 得满分', category: '服务' },
    { id: 'Q-04', name: '成本降低额', weight: 10, criteria: '>5% 得满分', category: '成本' },
    { id: 'Q-05', name: '售后反馈时间', weight: 5, criteria: '<2h 得满分', category: '服务' },
    { id: 'Q-06', name: '文档完整性', weight: 5, criteria: '无缺失', category: '管理' },
    { id: 'Q-07', name: '环境体系认证', weight: 2, criteria: '持有证书', category: '管理' },
    { id: 'Q-08', name: '安全生产达标', weight: 2, criteria: '一级达标', category: '管理' },
    { id: 'Q-09', name: '技术支持能力', weight: 5, criteria: '专家驻场', category: '技术' },
    { id: 'Q-10', name: '样品合格率', weight: 5, criteria: '100% 合格', category: '研发' },
    { id: 'Q-11', name: '突发订单响应', weight: 3, criteria: '<24h 响应', category: '服务' },
    { id: 'Q-12', name: '价格波动承受', weight: 2, criteria: '<10% 内部消化', category: '商务' },
    { id: 'Q-13', name: '包装合规性', weight: 1, criteria: '无破损', category: '物流' },
    { id: 'Q-14', name: '社会责任评估', weight: 1, criteria: 'CSR 报告', category: '品牌' },
    { id: 'Q-15', name: '战略协同度', weight: 4, criteria: '深度合作', category: '战略' }
  ];

  const [params, setParams] = useState<QualityIndicator[]>(initialParams);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            {t('质量评价参数定义 (15)', 'Quality Parameters (15)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('定义供应商评价的核心指标与权重分配', 'Define core KPIs and weights for supplier evaluation')}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all font-medium">
          <Plus size={18} /> {t('新增指标', 'Add Indicator')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {params.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group relative">
            <button className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={14} />
            </button>
            <div className="flex justify-between items-start mb-3">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">{p.category}</span>
              <span className="text-emerald-600 font-bold text-lg">{p.weight}%</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{p.name}</h4>
            <p className="text-xs text-slate-500 font-medium italic">{t('标准', 'Criteria')}: {p.criteria}</p>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${p.weight}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('新增质量评价指标', 'Add Quality Indicator')} onConfirm={() => setModalOpen(false)} lang={lang}>
        <div className="space-y-4">
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('指标名称', 'Indicator Name')} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" type="number" placeholder={t('权重 %', 'Weight')} />
          <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('评价标准', 'Criteria')} />
        </div>
      </FormModal>
    </div>
  );
};

export default QualityParamsView;
