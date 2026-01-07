
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Clock, AlertTriangle, CheckCircle2, 
  Calendar, Search, Filter, Download, Activity,
  GanttChart, Boxes, Zap, ArrowRight, Timer
} from 'lucide-react';
import { Language, ProductionProgress } from '../types';

const ProdProgressView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const progressData = useMemo((): ProductionProgress[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    
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
    const atRisk = progressData.filter(p => p.status === 'At-risk').length;
    const averageProgress = progressData.reduce((acc, curr) => acc + curr.progress, 0) / total;
    return { total, completed, delayed, atRisk, averageProgress };
  }, [progressData]);

  const filteredData = progressData.filter(p => 
    p.itemName.includes(searchTerm) || p.drawingNo.includes(searchTerm) || p.id.includes(searchTerm)
  );

  const getStageDisplay = (stage: ProductionProgress['stage']) => {
    const map = {
      'Planning': { label: t('计划中', 'Planning'), color: 'bg-slate-100 text-slate-600' },
      'Purchasing': { label: t('采购中', 'Purchasing'), color: 'bg-blue-50 text-blue-600 border-blue-100' },
      'Manufacturing': { label: t('制造中', 'Manufacturing'), color: 'bg-amber-50 text-amber-600 border-amber-100' },
      'Inspection': { label: t('质检中', 'Inspection'), color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      'Completed': { label: t('已入库', 'Completed'), color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    };
    return map[stage] || { label: stage, color: 'bg-slate-100 text-slate-600' };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部生产执行力雷达 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('整体项目进度', 'Global Progress')}</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><GanttChart size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.averageProgress.toFixed(1)}%</h4>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
             <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${stats.averageProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('已入库物料', 'Completed Items')}</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Boxes size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-emerald-600">{stats.completed} <span className="text-xs font-normal text-slate-400">/ {stats.total}</span></h4>
          <p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-widest tracking-tighter">{t('今日达成 3 项', '3 Achieved Today')}</p>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('红区风险告警', 'Red Zone Risk')}</p>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><AlertTriangle size={18} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">{stats.delayed} <span className="text-xs font-normal text-slate-400">批次</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse">{t('需触发加急令', 'Expedited Order Req.')}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Timer className="text-white" size={48} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('交付节点预估', 'Delivery Est.')}</p>
          <h4 className="text-2xl font-black text-white">{t('正常', 'Nominal')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest tracking-tighter">{t('基于历史周期计算', 'Based on History')} | 92% {t('可达', 'Reach')}</p>
        </div>
      </div>

      {/* 控制中心 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('搜索部件名称、图号或工单号...', 'Search Part, DWG or Order...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('风险级别过滤', 'Risk Filters')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200">
            <Zap size={18} /> {t('触发重排产建议', 'Re-schedule')}
          </button>
        </div>
      </div>

      {/* 进度明细列表 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5 border-b border-slate-100">{t('工单/部件信息', 'Order / Part Info')}</th>
                <th className="px-6 py-5 border-b border-slate-100 text-center">{t('生产周期', 'Schedule')}</th>
                <th className="px-6 py-5 border-b border-slate-100">{t('实时流转进度', 'Real-time Progress')}</th>
                <th className="px-6 py-5 border-b border-slate-100 text-center">{t('当前流转节点', 'Stage')}</th>
                <th className="px-6 py-5 border-b border-slate-100 text-center">{t('状态预警', 'Status')}</th>
                <th className="px-6 py-5 border-b border-slate-100 text-center">{t('详情', 'Details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => {
                const stage = getStageDisplay(item.stage);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-900 tracking-tight">{item.id}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase">{item.itemName} <span className="font-mono text-[9px] text-slate-300 ml-1">[{item.drawingNo}]</span></div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Calendar size={12} className="text-slate-300" />
                          {item.startDate} <ArrowRight size={10} /> {item.planEndDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 min-w-[200px]">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              item.progress === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                              (item.status === 'Delayed' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'bg-blue-600')
                            }`} 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-900 w-8">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${stage.color} inline-flex items-center gap-1.5 uppercase tracking-tighter`}>
                        {item.stage === 'Completed' ? <CheckCircle2 size={12} /> : <Activity size={12} />}
                        {stage.label}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.status === 'On-track' ? 'text-emerald-600' : (item.status === 'At-risk' ? 'text-amber-600' : 'text-rose-600 animate-pulse')
                        }`}>
                          {item.status}
                        </span>
                        {item.delayDays > 0 && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-black mt-1">
                            +{item.delayDays}D {t('延期', 'Late')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部业务说明 */}
      <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent"></div>
        <div className="flex items-center gap-4 relative z-10">
           <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl"><Activity size={24} /></div>
           <div className="flex-1">
             <h5 className="text-white font-black text-sm uppercase tracking-widest mb-1">{t('生产预测与风险审计', 'Production Forecast & Risk Audit')}</h5>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-4xl">
               {t('本模块分析逻辑由 Node.js 实时计算引擎支持，通过比对 MySQL 中所有在制工单的平均标准工时（ST）与实际产出。任何标记为“Delayed”的项目将自动触发管理层邮件抄送与供应商协同指令。', 'Analysis logic supported by Node.js real-time engine, comparing actual output vs Standard Time (ST) in MySQL. All "Delayed" items automatically trigger escalation emails.')}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProdProgressView;
