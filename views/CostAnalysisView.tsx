
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DollarSign, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { Language } from '../types';

const CostAnalysisView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const data = [
    { name: t('机械类', 'Mechanical'), value: 1200000 },
    { name: t('电子类', 'Electronic'), value: 800000 },
    { name: t('化工类', 'Chemical'), value: 450000 },
    { name: t('办公类', 'Office'), value: 150000 },
  ];

  const vendorCosts = [
    { name: 'Alpha Elec', cost: 120 },
    { name: 'Beta Mech', cost: 210 },
    { name: 'Gamma Chem', cost: 85 },
    { name: 'Delta Log', cost: 45 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              <ArrowDownRight size={12} className="mr-1" />
              -2.4%
            </div>
          </div>
          <p className="text-sm text-slate-500">{t('单件平均成本', 'Avg. Unit Cost')}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">¥422.50</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 text-lg mb-6">{t('采购分类分布', 'Cost by Category')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold">¥{(item.value / 10000).toFixed(1)}w</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 text-lg mb-6">{t('供应商支出对比', 'Vendor Spending Contrast')}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorCosts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisView;
