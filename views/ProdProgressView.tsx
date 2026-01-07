
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Clock, AlertTriangle, CheckCircle2, 
  Calendar, Search, Filter, Download, ChevronRight, Activity
} from 'lucide-react';
import { Language, ProductionProgress } from '../types';

const ProdProgressView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const progressData = useMemo((): ProductionProgress[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    
    const stages: ProductionProgress['stage'][] = ['Planning', 'Purchasing', 'Manufacturing', 'Inspection', 'Completed'];

    return parts.map((name, i) => {
      const progress = i % 5 === 0 ? 100 : (i % 3 === 0 ? 35 : 75);
      const stage = progress === 100 ? 'Completed' : (progress > 70 ? 'Inspection' : (progress > 30 ? 'Manufacturing' : 'Purchasing'));
      
      let status: ProductionProgress['status'] = 'On-track';
      let delayDays = 0;
      
      if (i % 7 === 0 && progress < 100) {
        status = 'Delayed';
        delayDays = 5 + (i % 10);
      } else if (i % 4 === 0 && progress < 100) {
        status = 'At-risk';
        delayDays = 1 + (i % 3);
      }

      return {
        id: `PROD-26-${(400 + i)}`,
        itemName: name,
        drawingNo: `DWG-${300 + i}`,
        startDate: `2025-12-${(i % 15) + 1}`.padStart(10, '0'),
        planEndDate: `2026-02-${(i % 25) + 5}`.padStart(10, '0'),
        progress,
        stage: stage as ProductionProgress['stage'],
        status,
        delayDays
      };
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const total = progressData.length;
    const completed = progressData.filter(p => p.progress === 100).length;
    const delayed = progressData.filter(p => p.status === 'Delayed').length;
    const averageProgress = progressData.reduce((acc, curr) => acc + curr.progress, 0) / total;
    return { total, completed, delayed, averageProgress };
  }, [progressData]);

  const filteredData = progressData.filter(p => 
    p.itemName.includes(searchTerm) || p.drawingNo.includes(searchTerm) || p.id.includes(searchTerm)
  );

  const getStageColor = (stage: ProductionProgress['stage']) => {
    switch (stage) {
      case 'Planning': return 'bg-slate-100 text-slate-600';
      case 'Purchasing': return 'bg-blue-100 text-blue-700';
      case 'Manufacturing': return 'bg-amber-100 text-amber-700';
      case 'Inspection': return 'bg-indigo-100 text-indigo-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status: ProductionProgress['status']) => {
    switch (status) {
      case 'On-track': return 'text-emerald-600';
      case 'At-risk': return 'text-amber-600';
      case 'Delayed': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            {t('生产进度计划分析 (21)', 'Production Progress Analysis (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('实时监控各部件生产流转节点与延期风险', 'Real-time monitoring of production nodes and delay risks')}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索部件、图号...', 'Search parts, DWG...')}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50"><Filter size={18} /></button>
          <button className="p-2 bg-white border rounded-lg text-slate-500 hover:bg-slate-50"><Download size={18} /></button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('整体平均进度', 'Avg Progress')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{stats.averageProgress.toFixed(1)}%</h4>
            <TrendingUp size={20} className="text-emerald-500 mb-1" />
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${stats.averageProgress}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('已入库完成', 'Completed')}</p>
          <h4 className="text-2xl font-black text-emerald-600">{stats.completed} <span className="text-xs font-normal text-slate-400">/ {stats.total}</span></h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('本周新增 3 项入库', '+3 items stored this week')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('延期预警项目', 'Delayed Items')}</p>
          <h4 className="text-2xl font-black text-rose-600">{stats.delayed}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('涉及 2 个主要供应商', 'Affects 2 key suppliers')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('在制/在途', 'In Production')}</p>
          <h4 className="text-2xl font-black text-amber-600">{stats.total - stats.completed}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('预计 5 天内交付 8 项', '8 items due in 5 days')}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">{t('流水号/图号', 'ID / DWG No')}</th>
                <th className="px-6 py-4">{t('部件名称', 'Part Name')}</th>
                <th className="px-6 py-4 text-center">{t('时间周期', 'Timeline')}</th>
                <th className="px-6 py-4">{t('进度详情', 'Progress Detail')}</th>
                <th className="px-6 py-4 text-center">{t('当前阶段', 'Current Stage')}</th>
                <th className="px-6 py-4 text-center">{t('状态/预警', 'Status / Alert')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.drawingNo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{item.itemName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar size={10} />
                        {item.startDate} {t('至', 'to')} {item.planEndDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-[120px] bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : (item.status === 'Delayed' ? 'bg-rose-500' : 'bg-blue-600')}`} 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${getStageColor(item.stage)}`}>
                      {item.stage === 'Completed' && <CheckCircle2 size={10} />}
                      {t(
                        item.stage === 'Planning' ? '计划中' : item.stage === 'Purchasing' ? '采购中' : item.stage === 'Manufacturing' ? '制造中' : item.stage === 'Inspection' ? '质检中' : '已入库',
                        item.stage
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-bold ${getStatusColor(item.status)}`}>
                        {t(
                          item.status === 'On-track' ? '正常' : item.status === 'At-risk' ? '风险' : '延期',
                          item.status
                        )}
                      </span>
                      {item.delayDays > 0 && (
                        <span className="text-[9px] text-rose-500 font-black animate-pulse">
                          +{item.delayDays}D {t('延期', 'Late')}
                        </span>
                      )}
                    </div>
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

export default ProdProgressView;
