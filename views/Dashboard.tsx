
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, Line
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Package, 
  ShoppingCart, ShieldCheck, Activity, Zap, 
  ArrowUpRight, Target, Clock, AlertCircle
} from 'lucide-react';
import { Language } from '../types';

const Dashboard: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // Advanced Mock Data
  const stats = [
    { label: t('月度采购总额', 'Monthly Spending'), value: '¥2,840,000', change: '+12.5%', icon: <ShoppingCart className="text-blue-600" />, trend: 'up', color: 'blue' },
    { label: t('核心供应商数', 'Active Suppliers'), value: '142', change: '+4', icon: <Users className="text-emerald-600" />, trend: 'up', color: 'emerald' },
    { label: t('全线质量合格率', 'Overall Quality'), value: '98.2%', change: '+0.5%', icon: <ShieldCheck className="text-indigo-600" />, trend: 'up', color: 'indigo' },
    { label: t('待处理预警项', 'Critical Alerts'), value: '08', change: '-3', icon: <AlertCircle className="text-rose-600" />, trend: 'down', color: 'rose' },
  ];

  const mainTrendData = [
    { name: 'Sep', cost: 400, budget: 450, quality: 92 },
    { name: 'Oct', cost: 300, budget: 420, quality: 94 },
    { name: 'Nov', cost: 600, budget: 580, quality: 91 },
    { name: 'Dec', cost: 800, budget: 750, quality: 96 },
    { name: 'Jan', cost: 500, budget: 600, quality: 98 },
    { name: 'Feb', cost: 900, budget: 850, quality: 99 },
  ];

  const categoryData = [
    { name: t('机械类', 'Mechanical'), value: 45 },
    { name: t('电子类', 'Electronic'), value: 25 },
    { name: t('化工类', 'Chemical'), value: 15 },
    { name: t('物流服务', 'Logistics'), value: 10 },
    { name: t('其他', 'Others'), value: 5 },
  ];

  const supplierPerformance = [
    { name: 'Zhengqi', score: 98, delivery: 100, cost: 92 },
    { name: 'Alpha', score: 94, delivery: 95, cost: 88 },
    { name: 'PowerInd', score: 88, delivery: 85, cost: 95 },
    { name: 'T-Chain', score: 85, delivery: 92, cost: 78 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444'];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${s.color}-50 rounded-full opacity-50 transition-transform group-hover:scale-150 duration-500`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className={`p-3 bg-${s.color}-50 text-${s.color}-600 rounded-2xl shadow-inner`}>
                  {s.icon}
                </div>
                <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${
                  s.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                }`}>
                  {s.trend === 'up' ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                  {s.change}
                </div>
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{s.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Spending & Quality Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Zap className="text-blue-600" size={18} />
                {t('采购执行与预算效能分析', 'Purchasing Execution & Efficiency')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{t('跨维度监控成本支出与质量基准线', 'Cross-dimensional monitoring of spend vs quality baseline')}</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button className="px-3 py-1 bg-white shadow-sm rounded-lg text-xs font-bold text-slate-800">{t('近6月', '6M')}</button>
              <button className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600">{t('年度', 'Annual')}</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mainTrendData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" name={t('实际支出', 'Actual Cost')} />
                <Bar yAxisId="left" dataKey="budget" fill="#cbd5e1" barSize={10} radius={[5, 5, 0, 0]} opacity={0.3} name={t('预算限额', 'Budget Limit')} />
                <Line yAxisId="right" type="stepAfter" dataKey="quality" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name={t('合格率%', 'QC Pass %')} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Allocation Donut */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-black text-slate-900 text-lg mb-1">{t('品类采购资金分布', 'Category Allocation')}</h3>
          <p className="text-xs text-slate-400 mb-8">{t('当前资金在各核心品类的占用比例', 'Current fund occupation by core categories')}</p>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('总金额', 'Total')}</span>
              <span className="text-xl font-black text-slate-900">¥2.84M</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-4">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase truncate">{item.name}</span>
                <span className="text-[10px] font-black text-slate-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Radar/Bar Matrix */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Target size={18} className="text-emerald-600" />
              {t('供应商多维度能力矩阵', 'Supplier Performance Matrix')}
            </h3>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">{t('深度报告', 'Full Report')}</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformance} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar name={t('质量得分', 'Quality')} dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name={t('交付得分', 'Delivery')} dataKey="delivery" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name={t('成本得分', 'Cost')} dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Feed/Alerts */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <h3 className="font-black text-lg mb-6 flex items-center gap-2 relative z-10">
              <Activity size={18} className="text-blue-400" />
              {t('实时任务流 / 预警', 'Live Task / Alerts')}
           </h3>
           <div className="space-y-4 relative z-10 overflow-y-auto max-h-64 custom-scrollbar pr-2">
              {[
                { type: 'alert', title: t('高储预警', 'Stock Overflow'), desc: 'DWG-102 Gear Box > Quota', time: '2m ago', color: 'rose' },
                { type: 'task', title: t('待审批', 'Approval Req'), desc: 'Exp-202602-01 (Purchase Dept)', time: '15m ago', color: 'blue' },
                { type: 'qc', title: t('质检报告', 'QC Reported'), desc: 'Batch BAT-2601 Qualified', time: '1h ago', color: 'emerald' },
                { type: 'delay', title: t('到货延迟', 'Delivery Late'), desc: 'Zhengqi Mech - A1202', time: '3h ago', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full bg-${item.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-black uppercase tracking-tight">{item.title}</span>
                      <span className="text-[10px] text-white/40">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-white/60 truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-900/40">
              {t('进入指挥中心', 'Enter Command Center')}
           </button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200">
        <h3 className="font-black text-slate-900 text-lg mb-6">{t('快捷业务概览', 'Quick Business View')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t('本周入库', 'Weekly Entry')}</p>
                <h4 className="text-xl font-black text-slate-900">4,280 <span className="text-[10px] font-normal text-slate-400">PCS</span></h4>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600"><Package size={20} /></div>
           </div>
           <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">{t('降本指标', 'Saving Target')}</p>
                <h4 className="text-xl font-black text-slate-900">¥125.4K <span className="text-[10px] font-normal text-slate-400">YTD</span></h4>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><ArrowUpRight size={20} /></div>
           </div>
           <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{t('计划达成率', 'Plan Target')}</p>
                <h4 className="text-xl font-black text-slate-900">94.2%</h4>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Clock size={20} /></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
