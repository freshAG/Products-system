
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, Line, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Package, 
  ShoppingCart, ShieldCheck, Activity, Zap, 
  ArrowUpRight, Target, Clock, AlertCircle, Award, Star
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

  // Reshaped data for Radar Chart to show multidimensional capability matrix
  const radarData = [
    { subject: t('质量 (Quality)', 'Quality'), Zhengqi: 98, Alpha: 94, PowerInd: 88, TChain: 85, fullMark: 100 },
    { subject: t('交付 (Delivery)', 'Delivery'), Zhengqi: 100, Alpha: 95, PowerInd: 85, TChain: 92, fullMark: 100 },
    { subject: t('成本 (Cost)', 'Cost'), Zhengqi: 92, Alpha: 88, PowerInd: 95, TChain: 78, fullMark: 100 },
    { subject: t('服务 (Service)', 'Service'), Zhengqi: 85, Alpha: 98, PowerInd: 90, TChain: 88, fullMark: 100 },
    { subject: t('技术 (Tech)', 'Tech'), Zhengqi: 95, Alpha: 90, PowerInd: 82, TChain: 94, fullMark: 100 },
  ];

  const supplierList = [
    { name: 'Zhengqi', score: 94, color: '#3b82f6', trend: '+2' },
    { name: 'Alpha', score: 93, color: '#10b981', trend: '+1' },
    { name: 'PowerInd', score: 88, color: '#f59e0b', trend: '-1' },
    { name: 'T-Chain', score: 87, color: '#6366f1', trend: '+3' },
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

      {/* Secondary Row: Performance Radar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capability Radar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Target size={18} className="text-blue-600" />
                {t('供应商多维度能力矩阵', 'Supplier Capability Matrix')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{t('基于质量、交付、成本及技术的综合评估', 'Comprehensive evaluation of Quality, Delivery, Cost, and Tech')}</p>
            </div>
            <div className="flex gap-2">
               {supplierList.map((s, i) => (
                 <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{s.name}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar name="Zhengqi" dataKey="Zhengqi" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Alpha" dataKey="Alpha" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="PowerInd" dataKey="PowerInd" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Radar name="T-Chain" dataKey="TChain" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Leaderboard */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
           <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              {t('供应商综合实力榜', 'Supplier Leaderboard')}
           </h3>
           <div className="flex-1 space-y-5">
              {supplierList.map((s, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-lg transition-all">
                   <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-md" style={{ backgroundColor: s.color }}>
                            {i + 1}
                         </div>
                         <span className="font-black text-slate-800">{s.name}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-bold text-emerald-600">{s.trend} pts</span>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest">{t('周环比', 'Weekly')}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.score}%`, backgroundColor: s.color }}></div>
                      </div>
                      <span className="text-sm font-black text-slate-900">{s.score}</span>
                   </div>
                </div>
              ))}
           </div>
           <button className="mt-6 w-full py-2 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-blue-100 hover:text-blue-600 transition-all">
              {t('查看所有 142 家厂商', 'View All 142 Vendors')}
           </button>
        </div>
      </div>

      {/* Real-time Feed/Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-2xl text-white flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <h3 className="font-black text-lg mb-6 flex items-center gap-2 relative z-10">
              <Activity size={18} className="text-blue-400" />
              {t('实时任务流 / 预警中心', 'Live Command / Alert Center')}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                { type: 'alert', title: t('高储预警', 'Stock Overflow'), desc: 'DWG-102 Gear Box > Quota', time: '2m ago', color: 'rose' },
                { type: 'task', title: t('待审批', 'Approval Req'), desc: 'Exp-202602-01 (Purchase Dept)', time: '15m ago', color: 'blue' },
                { type: 'qc', title: t('质检报告', 'QC Reported'), desc: 'Batch BAT-2601 Qualified', time: '1h ago', color: 'emerald' },
                { type: 'delay', title: t('到货延迟', 'Delivery Late'), desc: 'Zhengqi Mech - A1202', time: '3h ago', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3 hover:bg-white/10 transition-colors group">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full bg-${item.color}-500 shadow-[0_0_12px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-black uppercase tracking-tight text-white/90">{item.title}</span>
                      <span className="text-[10px] text-white/40">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-white/60 truncate leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="mt-8 w-fit px-8 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-900/40">
              {t('进入全局指挥中心', 'Enter Global Command Center')}
           </button>
        </div>

        {/* Quick Insights Cards */}
        <div className="space-y-6">
           <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Clock size={20} /></div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800">{t('计划达成率', 'Plan Target')}</h4>
                    <p className="text-[10px] text-slate-400">{t('本季度目标 95%', 'Q1 Target 95%')}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '94.2%' }}></div>
                 </div>
                 <span className="text-lg font-black text-slate-900">94.2%</span>
              </div>
           </div>
           <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ArrowUpRight size={20} /></div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800">{t('降本盈余', 'Cost Saving')}</h4>
                    <p className="text-[10px] text-slate-400">{t('年度累计节省', 'YTD Total Savings')}</p>
                 </div>
              </div>
              <div className="flex justify-between items-end">
                 <h4 className="text-2xl font-black text-slate-900">¥125,400</h4>
                 <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">+12.4%</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
