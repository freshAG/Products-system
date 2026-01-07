
import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, AreaChart, Area 
} from 'recharts';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, Package, Search, 
  Download, Filter, TrendingUp, Wallet, Receipt 
} from 'lucide-react';
import { Language } from '../types';

interface CostDetail {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  prevPrice: number;
  variance: number;
  annualQty: number;
  totalSpend: number;
}

const CostAnalysisView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // Generate 21 mock records for testing
  const costRecords = useMemo((): CostDetail[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    const categories = [t('机械类', 'Mechanical'), t('电子类', 'Electronic'), t('化工类', 'Chemical'), t('物流类', 'Logistics')];
    
    return parts.map((name, i) => {
      const currentPrice = 500 + (i * 240);
      const prevPrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1)); // +/- 10% variance
      const variance = ((currentPrice - prevPrice) / prevPrice) * 100;
      const annualQty = 1000 + (i * 100);
      
      return {
        id: `PN-${1000 + i}`,
        name,
        category: categories[i % categories.length],
        currentPrice,
        prevPrice,
        variance,
        annualQty,
        totalSpend: currentPrice * annualQty
      };
    });
  }, [lang]);

  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const totalSpend = costRecords.reduce((acc, curr) => acc + curr.totalSpend, 0);
    const avgVariance = costRecords.reduce((acc, curr) => acc + curr.variance, 0) / costRecords.length;
    const highSpendItems = costRecords.filter(r => r.totalSpend > 5000000).length;
    return { totalSpend, avgVariance, highSpendItems };
  }, [costRecords]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    costRecords.forEach(r => {
      map[r.category] = (map[r.category] || 0) + r.totalSpend;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [costRecords]);

  const filteredRecords = costRecords.filter(r => 
    r.name.includes(searchTerm) || r.id.includes(searchTerm)
  );

  const trendData = [
    { name: 'Sep', spend: 240 }, { name: 'Oct', spend: 310 },
    { name: 'Nov', spend: 280 }, { name: 'Dec', spend: 350 },
    { name: 'Jan', spend: 420 }, { name: 'Feb', spend: 380 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            {t('采购成本分析报告 (21)', 'Procurement Cost Analysis (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('实时分析物料成本波动与采购支出规模', 'Real-time analysis of material cost fluctuations and spending scale')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">
            <Download size={14} /> {t('导出分析结果', 'Export Analysis')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('年度采购总额', 'Annual Total Spend')}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={16} /></div>
          </div>
          <h4 className="text-xl font-black text-slate-900">¥{(stats.totalSpend / 1000000).toFixed(2)}M</h4>
          <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
            <ArrowUpRight size={10} />
            {t('较上年度增长 8.4%', '+8.4% from last year')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('平均价格波动', 'Avg Price Variance')}</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={16} /></div>
          </div>
          <h4 className={`text-xl font-black ${stats.avgVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {stats.avgVariance > 0 ? '+' : ''}{stats.avgVariance.toFixed(2)}%
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('主要受芯片类物料影响', 'Mainly affected by chips')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('高价值采购项', 'High Spend Items')}</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Package size={16} /></div>
          </div>
          <h4 className="text-xl font-black text-slate-900">{stats.highSpendItems} {t('项', 'Items')}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('单项年度支出超过 ¥500w', 'Items with > ¥5M annual spend')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('本月采购凭证', 'Monthly Invoices')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Receipt size={16} /></div>
          </div>
          <h4 className="text-xl font-black text-slate-900">142 {t('份', 'Docs')}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('全部财务凭证已入账', 'All financial records posted')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            {t('采购月度支出趋势 (百万)', 'Monthly Spending Trend (Millions)')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">{t('品类资金占用比例', 'Spend by Category')}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-900 font-black">¥{(item.value / 10000).toFixed(0)}w</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索物料名称或编码...', 'Search item or P/N...')}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"><Filter size={18} /></button>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">{t('物料信息', 'Item Info')}</th>
                <th className="px-6 py-4 text-center">{t('品类', 'Category')}</th>
                <th className="px-6 py-4 text-right">{t('最新成交价', 'Current Price')}</th>
                <th className="px-6 py-4 text-right">{t('前期均价', 'Prev Price')}</th>
                <th className="px-6 py-4 text-center">{t('价格波动', 'Variance')}</th>
                <th className="px-6 py-4 text-right">{t('年度总支出', 'Annual Spend')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900 font-mono">¥{r.currentPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400 font-mono">
                    ¥{r.prevPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full ${
                      r.variance > 5 ? 'bg-rose-50 text-rose-600' : 
                      (r.variance < -5 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400')
                    }`}>
                      {r.variance > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(r.variance).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-blue-600">¥{(r.totalSpend / 10000).toFixed(0)}w</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisView;
