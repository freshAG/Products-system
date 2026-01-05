
import React, { useState } from 'react';
import { Search, Plus, UserCheck, Star, Edit, Trash2, MessageSquare, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, Purchaser, PurchaserEval } from '../types';
import FormModal from '../components/FormModal';

const PurchaserArchive: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  
  const generateInitialPurchasers = (): Purchaser[] => {
    const fixedNames = ['王旭', '王晓明', '李红', '张强', '刘伟', '陈静', '杨波', '周平', '赵敏', '孙悦', '吴健'];
    return fixedNames.map((name, i) => {
      const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
      const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');
      return { 
        id: `P${(i + 1).toString().padStart(3, '0')}`, 
        name: name, 
        phone: `13${i % 9}-9999-${1000 + i}`, 
        address: `总部大楼${i + 1}层采购部`, 
        rating: 4.0 + (Math.random() * 1.0),
        evaluations: [
          { id: `E0${i}1`, param: t('业务熟练度', 'Business Proficiency'), score: 85 + (i % 15), comment: t('表现稳健', 'Steady performance'), date: `2025-${month}-${day}` }
        ]
      };
    });
  };

  const [purchasers, setPurchasers] = useState<Purchaser[]>(generateInitialPurchasers());
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEvalModalOpen, setEvalModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Purchaser>>({});
  const [evalData, setEvalData] = useState<Partial<PurchaserEval>>({});
  const [selectedPurchaserId, setSelectedPurchaserId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newPurchaser = {
      ...formData,
      id: `P${(purchasers.length + 1).toString().padStart(3, '0')}`,
      rating: 5.0,
      evaluations: []
    } as Purchaser;
    setPurchasers([...purchasers, newPurchaser]);
    setModalOpen(false);
    setFormData({});
  };

  const handleDeletePurchaser = (id: string) => {
    setPurchasers(prev => prev.filter(p => p.id !== id));
  };

  const handleAddEval = () => {
    if (!selectedPurchaserId) return;
    setPurchasers(prev => prev.map(p => {
      if (p.id === selectedPurchaserId) {
        const newEval = {
          ...evalData,
          id: `E${(p.evaluations.length + 1).toString().padStart(3, '0')}`,
          date: new Date().toISOString().split('T')[0]
        } as PurchaserEval;
        const updatedEvals = [...p.evaluations, newEval];
        const avgScore = updatedEvals.reduce((acc, curr) => acc + (curr.score || 0), 0) / updatedEvals.length;
        return { ...p, evaluations: updatedEvals, rating: parseFloat((avgScore / 20).toFixed(1)) };
      }
      return p;
    }));
    setEvalModalOpen(false);
    setEvalData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" />
            {t('采购员档案管理 (11)', 'Purchaser Archive (11)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('维护采购员信息与绩效评估', 'Maintain purchaser profiles and performance evals')}</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-medium"
        >
          <Plus size={18} />
          {t('新增采购员', 'Add Purchaser')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {purchasers.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group animate-fadeIn">
            <div className="p-6 flex gap-6 border-b border-slate-50 relative">
              <button 
                onClick={() => handleDeletePurchaser(p.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner border border-blue-100">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mr-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{p.id}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                    <Star size={14} className="text-amber-500" fill="currentColor" />
                    <span className="text-amber-700 font-bold text-sm">{p.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider font-bold">{t('联系电话', 'Phone')}</p>
                    <p className="text-slate-700 font-medium">{p.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase tracking-wider font-bold">{t('部门/住址', 'Dept/Address')}</p>
                    <p className="text-slate-700 font-medium truncate">{p.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-500" />
                  {t('绩效评价系统', 'Evaluation System')}
                </h5>
                <button 
                  onClick={() => {
                    setSelectedPurchaserId(p.id);
                    setEvalModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white border border-blue-100 px-2 py-1 rounded-md shadow-sm"
                >
                  <Plus size={12} />
                  {t('录入评价', 'Add Eval')}
                </button>
              </div>

              {p.evaluations.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic">{t('暂无评价记录', 'No evaluations found')}</div>
              ) : (
                <div className="space-y-3">
                  {p.evaluations.slice(0, expandedId === p.id ? undefined : 2).map(ev => (
                    <div key={ev.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-800">{ev.param}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-blue-600">{ev.score}</span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-2 leading-relaxed">"{ev.comment}"</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-1">
                        <div className="flex items-center gap-1"><Calendar size={10} />{ev.date}</div>
                        <button className="hover:text-rose-500">{t('删除', 'Delete')}</button>
                      </div>
                    </div>
                  ))}
                  
                  {p.evaluations.length > 2 && (
                    <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="w-full py-1 text-[10px] text-slate-400 hover:text-blue-500 flex items-center justify-center gap-1">
                      {expandedId === p.id ? <><ChevronUp size={12} /> {t('收起', 'Less')}</> : <><ChevronDown size={12} /> {t('更多', 'More')}</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('新增采购员', 'Add Purchaser')} onConfirm={handleAdd} lang={lang}>
        <div className="space-y-4">
          <input type="text" placeholder={t('姓名', 'Name')} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input type="text" placeholder={t('电话', 'Phone')} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <textarea placeholder={t('部门/住址', 'Address')} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2}></textarea>
        </div>
      </FormModal>

      <FormModal isOpen={isEvalModalOpen} onClose={() => setEvalModalOpen(false)} title={t('新增评估', 'Add Eval')} onConfirm={handleAddEval} lang={lang}>
        <div className="space-y-4">
          <input type="text" placeholder={t('评估维度', 'Dimension')} onChange={e => setEvalData({...evalData, param: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input type="number" placeholder={t('评分 (0-100)', 'Score')} onChange={e => setEvalData({...evalData, score: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          <textarea placeholder={t('评价意见', 'Comments')} onChange={e => setEvalData({...evalData, comment: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows={3}></textarea>
        </div>
      </FormModal>
    </div>
  );
};

export default PurchaserArchive;
