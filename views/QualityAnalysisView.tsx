
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  BarChart3, ShieldCheck, ShieldAlert, Award, TrendingUp, 
  Search, Download, Filter, Target, Zap, Activity,
  LineChart as LineIcon, PieChart as PieIcon
} from 'lucide-react';
import { Language } from '../types';

interface QualityPerformance {
  id: string;
  itemName: string;
  supplier: string;
  totalBatches: number;
  passRate: number;
  ppm: number;
  score: number;
  majorDefects: number;
  grade: 'A' | 'B' | 'C' | 'D';
}

const QualityAnalysisView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 Node.js 获取的聚合数据，源自 MySQL 中的 inspection_requests 与 quality_params 表
  const mockData = useMemo((): QualityPerformance[] => {
    const parts = [
      '轴承 Z-9', '主控芯片 IC-10', '微型马达 MT-5', '高压管路 HP-8', 
      '齿轮 A-12', '控制板 V-2', '传感器 C-0', '液压泵 H-5', '法兰盘 F-2',
      '密封圈 S-88', '传动轴 B-05', '连接销 P-1', '散热器 R-4', '阀门 G-6', '弹簧 T-1'
    ];
    
    return parts.map((name, i) => {
      const passRate = 95 + Math.random() * 5;
      const score = Math.floor(80 + Math.random() * 20);
      const majorDefects = i % 12 === 0 ? 1 : 0;
      const ppm = Math.floor((1 - passRate / 100) * 1000000);
      
      let grade: QualityPerformance['grade'] = 'B';
      if (score >= 95) grade = 'A';
      else if (score >= 85) grade = 'B';
      else if (score >= 75) grade = 'C';
      else grade = 'D';

      return {
        id: `QA-LOG-${2026}${100 + i}`,
        itemName: name,
        supplier: i % 2 === 0 ? '正奇机械有限公司' : 'Alpha Electronic Ltd',
        totalBatches: 50 + i * 5,
        passRate,
        ppm,
        score,
        majorDefects,
        grade
      };
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  // 模拟后端聚合后的月度趋势数据
  const trendData = [
    { name: 'Sep', rate: 94.2, score: 85 },
    { name: 'Oct', rate: 95.8, score: 88 },
    { name: 'Nov', rate: 93.5, score: 84 },
    { name: 'Dec', rate: 97.1, score: 92 },
    { name: 'Jan', rate: 98.4, score: 95 },
    { name: 'Feb', rate: 98.2, score: 94 },
  ];

  const defectDistribution = [
    { name: t('关键尺寸超差', 'Dimension'), value: 45 },
    { name: t('表面涂层缺陷', 'Coating'), value: 25 },
    { name: t('材质硬度不足', 'Material'), value: 20 },
    { name: t('功能性失效', 'Functional'), value: 10 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const filteredData = mockData.filter(d => 
    d.itemName.includes(searchTerm) || d.supplier.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 顶部品质大脑看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('全厂综合质量分', 'Global Quality Score')}</p>
          <h4 className="text-2xl font-black text-slate-900 relative z-10">92.4 <span className="text-xs font-normal text-slate-400">/ 100</span></h4>
          <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-bold relative z-10">
            <TrendingUp size={12} /> +2.4pts {t('较上月', 'vs Last Month')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('首检合格率 FPY', 'First-Pass Yield')}</p>
          <h4 className="text-2xl font-black text-emerald-600 relative z-10">98.2%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden relative z-10">
            <div className="bg-emerald-500 h-full" style={{ width: '98.2%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-rose-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('严重质量事故', 'Critical Defects')}</p>
          <h4 className="text-2xl font-black text-rose-600 relative z-10">02 <span className="text-xs font-normal text-slate-400">项</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse relative z-10">{t('已触发不合格处理流程', 'CAPA Active')}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Activity className="text-white" size={60} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('数据计算引擎', 'Engine Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('实时同步', 'Live Agg.')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('MySQL 聚合算法支撑', 'Powered by Node.js')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 质量趋势分析图 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <LineIcon className="text-blue-600" size={20} />
              {t('月度质量指数变化趋势', 'Monthly Quality Index Trend')}
            </h3>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Zap size={18} /></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" name={t('合格率%', 'Pass Rate')} />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fillOpacity={0} name={t('综合分', 'Score')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 缺陷分布 */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
            <PieIcon className="text-rose-600" size={20} />
            {t('缺陷类型构成分析', 'Defect Type Distribution')}
          </h3>
          <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-widest">{t('Pareto 帕累托效应分析', 'Pareto Principle Analysis')}</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {defectDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {defectDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-500 font-bold uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-slate-900 font-black">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 详细业绩档案表格 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('快速检索物料名称、供应商或分值...', 'Search Item, Vendor, or Score...')}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
              <Download size={16} /> {t('导出业绩报表', 'Export Analytics')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">{t('品质部件 / 主力供应商', 'Part / Main Supplier')}</th>
                <th className="px-6 py-5 text-center">{t('统计批次', 'Sample Size')}</th>
                <th className="px-6 py-5 text-center">{t('加权合格率', 'W. Pass Rate')}</th>
                <th className="px-6 py-5 text-center">{t('PPM 缺陷水平', 'PPM Level')}</th>
                <th className="px-6 py-5 text-center">{t('业绩评分', 'Perf. Score')}</th>
                <th className="px-8 py-5 text-center">{t('系统评级', 'Grade')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">{d.itemName}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase mt-0.5">{d.supplier}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold text-slate-600 font-mono">{d.totalBatches} {t('批', 'B')}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[11px] font-black ${d.passRate >= 98 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {d.passRate.toFixed(1)}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${d.passRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[11px] font-black font-mono ${d.ppm > 1000 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {d.ppm.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-blue-600">{d.score}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1 rounded text-[10px] font-black shadow-sm ${
                      d.grade === 'A' ? 'bg-emerald-600 text-white' : 
                      (d.grade === 'B' ? 'bg-blue-600 text-white' : 
                      (d.grade === 'C' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'))
                    }`}>
                      Grade {d.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部法律与审计声明 */}
      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 border-dashed relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-600"></div>
        <div className="flex items-start gap-4">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={24} /></div>
           <div className="flex-1">
             <h5 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-1">{t('质量数据合规审计', 'Quality Data Compliance Audit')}</h5>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-4xl">
               {t('本分析模块完全基于 MySQL 生产环境的历史质检流水，计算模型严格遵循 ISO 9001:2015 质量管理体系。Node.js 后端确保了统计过程控制（SPC）的实时性。业绩评分是年度供应商评审的核心准入依据。', 'Analytics derived from MySQL historical QC logs, models follow ISO 9001:2015 standards. Node.js backend ensures real-time SPC. Performance scores are the core criteria for annual vendor appraisal.')}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAnalysisView;
