
import React, { useState, useMemo } from 'react';
import { Package, Plus, Search, Filter, Trash2, Edit, DollarSign } from 'lucide-react';
import { Language, SupplierProduct } from '../types';
import FormModal from '../components/FormModal';

const SupplierProducts: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialProducts = (): SupplierProduct[] => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: `SP${(i + 1).toString().padStart(3, '0')}`,
      supplierId: `SUP${((i % 32) + 1).toString().padStart(3, '0')}`,
      supplierName: i % 2 === 0 ? `正奇机械 ${((i % 32) + 1)} 公司` : `Alpha Elec ${((i % 32) + 1)} Ltd`,
      drawingNo: `DWG-${200 + i}`,
      model: `M-${i + 10}`,
      specs: i % 3 === 0 ? '标准级' : '高精度',
      unitPrice: 100 + (Math.random() * 2000),
      supplyRatio: i % 2 === 0 ? 60 : 40
    }));
  };

  const [products, setProducts] = useState<SupplierProduct[]>(generateInitialProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SupplierProduct>>({});

  const handleAdd = () => {
    const newProduct = {
      ...formData,
      id: `SP${(products.length + 1).toString().padStart(3, '0')}`,
      supplierName: formData.supplierName || 'Manual Entry Vendor'
    } as SupplierProduct;
    setProducts([...products, newProduct]);
    setModalOpen(false);
    setFormData({});
  };

  // Filter logic based on supplier name, drawing number, and model
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter(p => 
      p.supplierName.toLowerCase().includes(lowerSearch) ||
      p.drawingNo.toLowerCase().includes(lowerSearch) ||
      p.model.toLowerCase().includes(lowerSearch)
    );
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={24} className="text-blue-600" />
            {t(`产品供应清单 (${filteredProducts.length})`, `Supply Details (${filteredProducts.length})`)}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('跨供应商的产品成本与配给分析', 'Cross-supplier cost and allocation analysis')}</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all font-medium"
        >
          <Plus size={18} /> {t('新增供货记录', 'Add Supply Record')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('搜索供应商、图号或型号...', 'Search Vendor, DWG or Model...')}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm outline-none"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"><Filter size={20} /></button>
        </div>

        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('供应商', 'Supplier')}</th>
                <th className="px-6 py-4">{t('图号/型号', 'DWG / Model')}</th>
                <th className="px-6 py-4">{t('规格', 'Specs')}</th>
                <th className="px-6 py-4 text-center">{t('单价', 'Unit Price')}</th>
                <th className="px-6 py-4 text-center">{t('比例 %', 'Ratio %')}</th>
                <th className="px-6 py-4 text-center">{t('操作', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{p.supplierName}</div>
                      <div className="text-xs text-slate-400">{p.supplierId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-slate-700">{p.drawingNo}</div>
                      <div className="text-xs text-slate-500">{p.model}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.specs}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-emerald-600">¥{p.unitPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-slate-700">{p.supplyRatio}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${p.supplyRatio}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-blue-600 p-1"><Edit size={16} /></button>
                        <button className="text-slate-400 hover:text-rose-500 p-1" onClick={() => setProducts(products.filter(item => item.id !== p.id))}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    {t('未找到匹配的产品供应记录', 'No matching supply records found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('录入产品详情', 'Supply Info')} onConfirm={handleAdd} lang={lang}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('供应商名称', 'Vendor')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('输入供应商名称', 'Vendor Name')} onChange={e => setFormData({...formData, supplierName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('图号', 'DWG')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('输入图号', 'DWG Number')} onChange={e => setFormData({...formData, drawingNo: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('型号', 'Model')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('输入型号', 'Model Number')} onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('单价', 'Price')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" type="number" placeholder={t('单价 ¥', 'Price')} onChange={e => setFormData({...formData, unitPrice: parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('比例', 'Ratio %')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" type="number" placeholder={t('供货比例 %', 'Ratio %')} onChange={e => setFormData({...formData, supplyRatio: parseFloat(e.target.value)})} />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default SupplierProducts;
