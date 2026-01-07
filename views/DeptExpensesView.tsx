
import React, { useState, useMemo } from 'react';
import { DollarSign, Search, Plus, Filter, Download, PieChart, CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Language, DeptExpense } from '../types';
import FormModal from '../components/FormModal';

const DeptExpensesView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const generateInitialExpenses = (): DeptExpense[] => {
    const depts = [t('采购部', 'Procurement'), t('质检部', 'Quality'), t('仓库部', 'Warehouse'), t('行政部', 'Admin')];
    const cats = [t('办公用品', 'Office'), t('差旅费', 'Travel'), t('维修费', 'Maintenance'), t('培训费', 'Training'), t('物流费', 'Logistics')];
    const users = ['王经理', '李主任', '张工', '赵总'];

    return Array.from({ length: 21 }, (_, i) => {
      const amount = 500 + Math.floor(Math.random() * 8000);
      const month = (Math.floor(Math.random() * 3) + 11).toString().padStart(2, '0'); // 2025-11 to 2026-02
      const year = month === '11' || month === '12' ? '2025' : '2026';
      const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');

      return {
        id: `EXP-${year}${month}-${(100 + i)}`,
        date: `${year}-${month}-${day}`,
        department: depts[i % depts.length],
        category: cats[i % cats.length],
        description: `${cats[i % cats.length]}${t('相关费用支出项目', ' related expense item')} - ${i + 1}`,
        amount: amount,
        approver: users[i % users.length],
        status: i % 7 === 0 ? 'Rejected' : (i % 3 === 0 ? 'Pending' : 'Approved')
      };
    });
  };

  const [expenses, setExpenses] = useState<DeptExpense[]>(generateInitialExpenses());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DeptExpense>>({});

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.department.includes(searchTerm) || 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.includes(searchTerm)
    );
  }, [expenses, searchTerm]);

  const stats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = expenses.filter(e => e.status === 'Pending').length;
    const highValue = expenses.filter(e => e.amount > 5000).length;
    return { total, pending, highValue };
  }, [expenses]);

  const handleAdd = () => {
    const newExpense = {
      ...formData,
      id: `EXP-MAN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    } as DeptExpense;
    setExpenses([newExpense, ...expenses]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">{t('总费用累计', 'Total Expenses')}</p>
            <h4 className="text-2xl font-bold text-slate-900">¥{stats.total.toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">{t('待处理审批', 'Pending Approvals')}</p>
            <h4 className="text-2xl font-bold text-slate-900">{stats.pending} {t('笔', 'Items')}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><CreditCard size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">{t('大额支出(>5k)', 'High Value Items')}</p>
            <h4 className="text-2xl font-bold text-slate-900">{stats.highValue} {t('笔', 'Items')}</h4>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="text-blue-600" />
            {t('部门费用明细汇总 (21)', 'Department Expenses (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('财务合规性与部门预算执行监控', 'Financial compliance and budget execution monitoring')}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50"><Download size={18} /></button>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            + {t('新增报销单', 'New Expense')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索单号、部门或摘要...', 'Search ID, Dept or Desc...')}
              className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"><Filter size={18} /></button>
        </div>

        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('单据信息', 'Expense ID')}</th>
                <th className="px-6 py-4">{t('摘要说明', 'Description')}</th>
                <th className="px-6 py-4 text-center">{t('费用类别', 'Category')}</th>
                <th className="px-6 py-4 text-right">{t('金额', 'Amount')}</th>
                <th className="px-6 py-4 text-center">{t('审批状态', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('审批人', 'Approver')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{exp.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{exp.date} | {exp.department}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{exp.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${exp.amount > 5000 ? 'text-rose-600' : 'text-slate-900'}`}>
                      ¥{exp.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      exp.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {exp.status === 'Approved' ? <CheckCircle2 size={10} /> : exp.status === 'Rejected' ? <XCircle size={10} /> : <Clock size={10} />}
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500">{exp.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={t('财务费用报销录入', 'Expense Entry')} 
        onConfirm={handleAdd} 
        lang={lang}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('费用摘要', 'Description')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('输入费用用途说明', 'Expense purpose')} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('归属部门', 'Department')}</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm" onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="采购部">{t('采购部', 'Procurement')}</option>
              <option value="质检部">{t('质检部', 'Quality')}</option>
              <option value="仓库部">{t('仓库部', 'Warehouse')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('费用类别', 'Category')}</label>
            <select className="w-full px-3 py-2 border rounded-lg text-sm" onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="办公用品">{t('办公用品', 'Office')}</option>
              <option value="差旅费">{t('差旅费', 'Travel')}</option>
              <option value="物流费">{t('物流费', 'Logistics')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('报销金额', 'Amount')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm" type="number" placeholder="¥ 0.00" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('审批人', 'Approver')}</label>
            <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={t('审批人员姓名', 'Approver name')} onChange={e => setFormData({...formData, approver: e.target.value})} />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default DeptExpensesView;
