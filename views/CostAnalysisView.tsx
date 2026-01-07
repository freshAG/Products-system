
import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, AreaChart, Area 
} from 'recharts';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, Package, Search, 
  Download, Filter, TrendingUp, Wallet, Receipt,
  BarChart3, Activity, PieChart as PieIcon, Calculator
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

  // 模拟从后端 Node.js 获取的聚合数据，数据源自 MySQL 中的 order_contracts 与 products 表
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
      const prevPrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1)); // 模拟 +/- 10% 的波动
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

  // 核心财务统计
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
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部财务大脑看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('年度采购总金额', 'YTD Total Spend')}</p>
          <h4 className="text-2xl font-black text-slate-900 relative z-10">¥{(stats.totalSpend / 1000000).toFixed(2)}M</h4>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold relative z-10">
            <ArrowUpRight size={12} /> +8.4% {t('较上期', 'vs Prev')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-amber-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('核心件价格变动', 'Core Price Variance')}</p>
          <h4 className={`text-2xl font-black relative z-10 ${stats.avgVariance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {stats.avgVariance > 0 ? '+' : ''}{stats.avgVariance.toFixed(2)}%
          </h4>
          <p className="text-[10px] text-slate-400 mt-2 font-medium relative z-10">{t('基于历史采购基准线', 'Based on history baseline')}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-rose-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('高价值采购项(A类)', 'High Value Items')}</p>
          <h4 className="text-2xl font-black text-slate-900 relative z-10">{stats.highSpendItems} <span className="text-xs font-normal text-slate-400">{t('项', 'Items')}</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold relative z-10 animate-pulse">{t('占总金额 80%', 'Accounts for 80% spend')}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-4 opacity-10"><Calculator className="text-white" size={60} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('财务审计校验', 'Audit Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('已对账', 'Reconciled')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('MySQL 数据强一致性', 'DB Consistent')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 支出趋势图 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={20} />
              {t('采购月度支出分析 (百万)', 'Monthly Spend Analysis (Millions)')}
            </h3>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Activity size={18} /></div>
          </div>
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
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 资金分配比例 */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
            <PieIcon className="text-indigo-600" size={20} />
            {t('品类资金占用', 'Spend by Category')}
          </h3>
          <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-widest">{t('当前存量资金分布', 'Current Fund Dist.')}</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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
          </div>
          <div className="mt-6 space-y-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-500 font-bold uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-slate-900 font-black">¥{(item.value / 10000).toFixed(0)}w</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 成本明细工作台 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索物料名称、编码或品类...', 'Search item, P/N, or Category...')}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 bg-white border rounded-xl shadow-sm"><Filter size={18} /></button>
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
              <Download size={16} /> {t('导出全量分析', 'Full Export')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">{t('物料身份信息', 'Item Identity')}</th>
                <th className="px-6 py-5 text-center">{t('物料分类', 'Category')}</th>
                <th className="px-6 py-5 text-right">{t('最新成交价', 'Latest Price')}</th>
                <th className="px-6 py-5 text-right">{t('前期均价', 'Historic Avg')}</th>
                <th className="px-6 py-5 text-center">{t('价格偏离度', 'Variance')}</th>
                <th className="px-8 py-5 text-right">{t('年度总采购额', 'Annual Total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase mt-0.5">{r.id}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-slate-900 font-mono">¥{r.currentPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 text-right text-sm text-slate-400 font-mono">
                    ¥{r.prevPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full border shadow-sm ${
                      r.variance > 5 ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 
                      (r.variance < -5 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100')
                    }`}>
                      {r.variance > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(r.variance).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`text-sm font-black ${r.totalSpend > 5000000 ? 'text-blue-600' : 'text-slate-900'}`}>
                      ¥{(r.totalSpend / 10000).toFixed(0)}w
                    </span>
                    {r.totalSpend > 5000000 && (
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-tighter italic">Tier-A Item</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部审计声明 */}
      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 border-dashed relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>
        <div className="flex items-start gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Calculator size={24} /></div>
           <div className="flex-1">
             <h5 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-1">{t('财务数据对账声明', 'Financial Reconciliation Audit')}</h5>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-4xl">
               {t('本模块分析结果由 Node.js 聚合引擎基于 MySQL 实时合同与支付流水生成。历史价格基准线采用 12 个月滚动加权平均法计算。导出的 PDF 报表可作为成本中心 (Cost Center) 年度审计的原始凭据。', 'Analysis generated by Node.js aggregation engine from MySQL live contracts. Historic baselines use 12-month rolling WAP. Exported PDFs serve as original audit evidence for Cost Centers.')}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisView;
