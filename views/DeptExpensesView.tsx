
import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Search, Plus, Filter, Download, 
  PieChart, CreditCard, CheckCircle2, XCircle, 
  Clock, Receipt, FileStack, TrendingUp, AlertCircle
} from 'lucide-react';
import { Language, DeptExpense } from '../types';
import FormModal from '../components/FormModal';

const DeptExpensesView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialExpenses = (): DeptExpense[] => {
    const depts = [t('采购部', 'Procurement'), t('质检部', 'Quality'), t('仓库部', 'Warehouse'), t('行政部', 'Admin'), t('技术研发部', 'R&D')];
    const cats = [t('办公用品', 'Office'), t('差旅费', 'Travel'), t('维修费', 'Maintenance'), t('培训费', 'Training'), t('物流费', 'Logistics'), t('研发耗材', 'R&D Material')];
    const users = ['王经理', '李主任', '张工', '赵总', '陈总监'];

    return Array.from({ length: 25 }, (_, i) => {
      const amount = 500 + Math.floor(Math.random() * 12000);
      const month = (Math.floor(Math.random() * 2) + 1).toString().padStart(2, '0'); // 2026-01 to 2026-02
      const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');

      return {
        id: `EXP-26${month}-${(100 + i)}`,
        date: `2026-${month}-${day}`,
        department: depts[i % depts.length],
        category: cats[i % cats.length],
        description: `${cats[i % cats.length]}${t('相关费用支出项目', ' related expense item')} - ${i + 1}`,
        amount: amount,
        approver: users[i % users.length],
        status: i % 10 === 0 ? 'Rejected' : (i % 4 === 0 ? 'Pending' : 'Approved')
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

  // 模拟后端聚合查询看板数据
  const stats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = expenses.filter(e => e.status === 'Pending').length;
    const highValue = expenses.filter(e => e.amount > 5000).length;
    const rejected = expenses.filter(e => e.status === 'Rejected').length;
    return { total, pending, highValue, rejected };
  }, [expenses]);

  const handleAdd = () => {
    const newExpense = {
      ...formData,
      id: `EXP-2602-M${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    } as DeptExpense;
    setExpenses([newExpense, ...expenses]);
    setModalOpen(false);
    setFormData({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 财务数据概览看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('全厂累计支出', 'Total Spend')}</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><DollarSign size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">¥{stats.total.toLocaleString()}</h4>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp size={12} /> +12.5% {t('环比上月', 'MoM')}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('待处理审批单', 'Pending Approvals')}</p>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors"><Clock size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.pending} <span className="text-xs font-normal text-slate-400">单</span></h4>
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">{t('平均处理时长 4.5h', 'Avg. Lead Time 4.5h')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('异常高额支出', 'High Value Risk')}</p>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors"><AlertCircle size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">{stats.highValue} <span className="text-xs font-normal text-slate-400">笔</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse">{t('单笔超过 ¥5,000', '> ¥5,000 items')}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><FileStack className="text-white" size={48} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('财务审计状态', 'Audit Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('合规', 'Compliant')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('通过内控检查', 'Internal Control Pass')}</p>
        </div>
      </div>

      {/* 操作工具栏 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('搜索报销号、摘要、或部门...', 'Search ID, Description, Dept...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('多维筛选', 'Filter')}
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200"
          >
            <Receipt size={18} /> {t('创建报销单', 'New Expense')}
          </button>
        </div>
      </div>

      {/* 费用明细表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('报销单号 / 发生日期', 'ID / Date')}</th>
                <th className="px-6 py-5">{t('费用主体与说明', 'Dept & Description')}</th>
                <th className="px-6 py-5 text-center">{t('费用类别', 'Category')}</th>
                <th className="px-6 py-5 text-right">{t('报销金额', 'Amount')}</th>
                <th className="px-6 py-5 text-center">{t('审批状态', 'Status')}</th>
                <th className="px-6 py-5 text-center">{t('核准人', 'Approver')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-900 font-mono">{exp.id}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">{exp.date}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{exp.department}</div>
                    <div className="text-[10px] text-slate-500 mt-1 max-w-xs truncate font-medium">{exp.description}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-tighter">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-black ${exp.amount > 5000 ? 'text-rose-600' : 'text-slate-900'}`}>
                        ¥{exp.amount.toLocaleString()}
                      </span>
                      {exp.amount > 5000 && (
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-tighter mt-0.5">High Value</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 shadow-sm border ${
                      exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      exp.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                    }`}>
                      {exp.status === 'Approved' ? <CheckCircle2 size={10} /> : exp.status === 'Rejected' ? <XCircle size={10} /> : <Clock size={10} />}
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-bold text-slate-700">{exp.approver}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5 italic">{t('电子签名', 'Digital Sign')}</div>
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
        title={t('费用报销单录入', 'Expense Reimbursement Form')} 
        onConfirm={handleAdd} 
        lang={lang}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('报销摘要', 'Description')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('输入费用详细用途说明', 'Describe expense purpose')} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('预算归属部门', 'Department')}</label>
            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="采购部">{t('采购部', 'Procurement')}</option>
              <option value="质检部">{t('质检部', 'Quality')}</option>
              <option value="仓库部">{t('仓库部', 'Warehouse')}</option>
              <option value="行政部">{t('行政部', 'Admin')}</option>
              <option value="技术研发部">{t('技术研发部', 'R&D')}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('费用分类', 'Category')}</label>
            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="办公用品">{t('办公用品', 'Office')}</option>
              <option value="差旅费">{t('差旅费', 'Travel')}</option>
              <option value="物流费">{t('物流费', 'Logistics')}</option>
              <option value="研发耗材">{t('研发耗材', 'R&D Material')}</option>
              <option value="维修费">{t('维修费', 'Maintenance')}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('报销金额 (¥)', 'Amount')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-blue-600 outline-none" type="number" placeholder="0.00" onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('直属审批人', 'Approver')}</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder={t('输入审批领导姓名', 'Enter approver name')} onChange={e => setFormData({...formData, approver: e.target.value})} />
          </div>
          <div className="col-span-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
             <AlertCircle size={18} className="text-blue-600 mt-0.5" />
             <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
               {t('提交后将进入流程中心，系统将自动核算该部门本月剩余预算额度。', 'Once submitted, the system will automatically calculate the remaining budget for this department.')}
             </p>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default DeptExpensesView;
