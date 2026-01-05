
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Edit, Trash2 } from 'lucide-react';
import { Language, Supplier } from '../types';
import FormModal from '../components/FormModal';

const SupplierArchive: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  
  const generateInitialSuppliers = (): Supplier[] => {
    const types = ['制造', '电子', '化工', '物流', '原材料'];
    const names = ['正奇机械', 'Alpha Elec', 'Beta Parts', '兴华科技', '盛泰物流', '嘉实化工', '天成轴承', '悦达包装'];
    return Array.from({ length: 32 }, (_, i) => ({
      id: `SUP${(i + 1).toString().padStart(3, '0')}`,
      name: `${names[i % names.length]}${i + 1}公司`,
      contact: `张${i + 1}经理`,
      manager: `刘${i + 1}总`,
      phone: `138-${(1000 + i).toString()}-${(2000 + i).toString()}`,
      zipCode: '200000',
      fax: '021-123456',
      address: `工业园区${i + 1}号路`,
      type: types[i % types.length],
      qaSystem: i % 2 === 0 ? 'ISO9001' : 'AS9100'
    }));
  };

  const [suppliers, setSuppliers] = useState<Supplier[]>(generateInitialSuppliers());
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  const handleAdd = () => {
    const newSupplier = {
      ...formData,
      id: `SUP${(suppliers.length + 1).toString().padStart(3, '0')}`
    } as Supplier;
    setSuppliers([...suppliers, newSupplier]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('供应商档案 (32)', 'Supplier Archive (32)')}</h2>
          <p className="text-slate-500 text-sm">{t('管理您的全球供应商伙伴', 'Manage your global supplier partnerships')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium">
            <Download size={18} />
            {t('导出', 'Export')}
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200 font-medium"
          >
            <Plus size={18} />
            {t('新增供应商', 'Add Supplier')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t('搜索供应商...', 'Search suppliers...')}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider shadow-sm">
                <th className="px-6 py-4">{t('名称', 'Name')}</th>
                <th className="px-6 py-4">{t('类型', 'Type')}</th>
                <th className="px-6 py-4">{t('负责人', 'Manager')}</th>
                <th className="px-6 py-4">{t('联系电话', 'Phone')}</th>
                <th className="px-6 py-4">{t('质保体系', 'QA System')}</th>
                <th className="px-6 py-4 text-center">{t('操作', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{s.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{s.manager}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{s.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                      {s.qaSystem}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
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
        title={t('新增供应商档案', 'Add Supplier Archive')}
        onConfirm={handleAdd}
        lang={lang}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('供应商名称', 'Supplier Name')}</label>
            <input type="text" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('负责人', 'Manager')}</label>
            <input type="text" onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('类型', 'Type')}</label>
            <input type="text" onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default SupplierArchive;
