
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  BarChart3, ShieldCheck, ShieldAlert, Award, TrendingUp, 
  Search, Download, Filter, Target, Zap 
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

  const mockData = useMemo((): QualityPerformance[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    
    return parts.map((name, i) => {
      const passRate = 90 + Math.random() * 10;
      const score = Math.floor(75 + Math.random() * 25);
      const majorDefects = i % 10 === 0 ? 1 : 0;
      const ppm = Math.floor((1 - passRate / 100) * 1000000);
      
      let grade: QualityPerformance['grade'] = 'B';
      if (score >= 95) grade = 'A';
      else if (score >= 85) grade = 'B';
      else if (score >= 75) grade = 'C';
      else grade = 'D';

      return {
        id: `QA-${3000 + i}`,
        itemName: name,
        supplier: i % 2 === 0 ? '正奇机械' : 'Alpha Elec',
        totalBatches: 20 + i,
        passRate,
        ppm,
        score,
        majorDefects,
        grade
      };
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const avgScore = mockData.reduce((acc, curr) => acc + curr.score, 0) / mockData.length;
    const avgPassRate = mockData.reduce((acc, curr) => acc + curr.passRate, 0) / mockData.length;
    const totalDefects = mockData.reduce((acc, curr) => acc + curr.majorDefects, 0);
    return { avgScore, avgPassRate, totalDefects };
  }, [mockData]);

  const defectDistribution = [
    { name: t('尺寸超差', 'Dimension'), value: 45 },
    { name: t('材质不符', 'Material'), value: 25 },
    { name: t('外观缺陷', 'Aesthetic'), value: 20 },
    { name: t('功能失效', 'Functional'), value: 10 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const filteredData = mockData.filter(d => 
    d.itemName.includes(searchTerm) || d.supplier.includes(searchTerm)
  );

  const topSuppliers = [
    { name: 'Zhengqi', score: 98 },
    { name: 'Alpha', score: 95 },
    { name: 'Beta', score: 92 },
    { name: 'Gamma', score: 88 },
    { name: 'Delta', score: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="text-blue-600" />
            {t('质量业绩深度分析 (21)', 'Quality Performance Analytics (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('基于历史质检数据构建供应商全生命周期质量画像', 'Building supplier quality profiles based on historical QC data')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">
            <Download size={14} /> {t('下载业绩报表', 'Download Report')}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('全厂综合质量分', 'Overall Quality Score')}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.avgScore.toFixed(1)}</h4>
          <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp size={10} />
            {t('优于行业平均 12%', '+12% vs industry avg')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('首检合格率 FPY', 'First-Pass Yield')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-emerald-600">{stats.avgPassRate.toFixed(1)}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.avgPassRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('严重质量缺陷数', 'Critical Defects')}</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldAlert size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">{stats.totalDefects}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('已触发二级质量预警', 'Level 2 QC alert triggered')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('质量提升指数', 'Improvement Index')}</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Zap size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-indigo-600">1.4x</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('降本提质效果显著', 'Significant cost-quality gain')}</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            {t('核心供应商质量评分 Top 5', 'Top 5 Supplier Quality')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSuppliers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fontSize: 10, fontWeight: 'bold', fill: '#1e293b' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6">{t('缺陷类型构成分布', 'Defect Type Breakdown')}</h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {defectDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3 pl-6">
              {defectDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索部件或供应商...', 'Search item or supplier...')}
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
                <th className="px-6 py-4">{t('部件名称', 'Part Name')}</th>
                <th className="px-6 py-4">{t('主力供应商', 'Key Supplier')}</th>
                <th className="px-6 py-4 text-center">{t('批次', 'Batches')}</th>
                <th className="px-6 py-4 text-center">{t('合格率', 'Pass Rate')}</th>
                <th className="px-6 py-4 text-center">{t('PPM值', 'PPM')}</th>
                <th className="px-6 py-4 text-center">{t('评分', 'Score')}</th>
                <th className="px-6 py-4 text-center">{t('等级', 'Grade')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{d.itemName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{d.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{d.supplier}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-slate-800">{d.totalBatches}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black ${d.passRate >= 98 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {d.passRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-mono text-slate-500">
                    {d.ppm.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-blue-600">{d.score}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      d.grade === 'A' ? 'bg-emerald-100 text-emerald-700' : 
                      (d.grade === 'B' ? 'bg-blue-100 text-blue-700' : 
                      (d.grade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'))
                    }`}>
                      {d.grade}
                    </span>
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

export default QualityAnalysisView;
