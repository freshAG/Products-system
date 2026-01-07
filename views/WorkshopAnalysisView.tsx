
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { 
  Factory, LayoutDashboard, Cpu, Clock, AlertCircle, 
  Search, Download, Filter, Gauge, CheckSquare, Layers,
  Activity, Zap, ArrowUpRight, Timer
} from 'lucide-react';
import { Language } from '../types';

interface WorkshopTask {
  id: string;
  workshop: string;
  itemName: string;
  progress: number;
  resource: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Running' | 'Queued' | 'Paused' | 'Completed';
  lastUpdate: string;
}

const WorkshopAnalysisView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 Node.js 获取的实时作业数据，数据源自 MySQL 中的 production_orders 表
  const mockTasks = useMemo((): WorkshopTask[] => {
    const workshops = [t('机加工车间', 'Machining'), t('总装车间', 'Assembly'), t('电子车间', 'Electronic'), t('涂装车间', 'Painting')];
    const resources = ['CNC-01', 'Line-A', 'Solder-X', 'Robo-P', 'Mill-05', 'Press-02'];
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];

    return parts.map((name, i) => {
      const statuses: WorkshopTask['status'][] = ['Running', 'Queued', 'Paused', 'Completed'];
      const status = i % 5 === 0 ? 'Completed' : (i % 7 === 0 ? 'Paused' : (i % 3 === 0 ? 'Queued' : 'Running'));
      const progress = status === 'Completed' ? 100 : (status === 'Queued' ? 0 : Math.floor(20 + Math.random() * 60));
      
      return {
        id: `WO-${2026}${200 + i}`,
        workshop: workshops[i % workshops.length],
        itemName: name,
        progress,
        resource: resources[i % resources.length],
        priority: i % 10 === 0 ? 'High' : (i % 3 === 0 ? 'Medium' : 'Low'),
        status,
        lastUpdate: `2026-02-${(i % 28) + 1}`.padStart(10, '0')
      };
    });
  }, [lang]);

  const [searchTerm, setSearchTerm] = useState('');

  // 模拟后端聚合后的 KPI
  const stats = useMemo(() => {
    const total = mockTasks.length;
    const running = mockTasks.filter(t => t.status === 'Running').length;
    const completed = mockTasks.filter(t => t.status === 'Completed').length;
    const avgEfficiency = 88.5; 
    return { total, running, completed, avgEfficiency };
  }, [mockTasks]);

  const loadData = [
    { name: t('机加工', 'Machining'), capacity: 100, actual: 85 },
    { name: t('总装', 'Assembly'), capacity: 100, actual: 92 },
    { name: t('电子', 'Electronic'), capacity: 100, actual: 65 },
    { name: t('涂装', 'Painting'), capacity: 100, actual: 78 },
  ];

  const statusDistribution = [
    { name: t('运行中', 'Running'), value: mockTasks.filter(t => t.status === 'Running').length },
    { name: t('排队中', 'Queued'), value: mockTasks.filter(t => t.status === 'Queued').length },
    { name: t('已暂停', 'Paused'), value: mockTasks.filter(t => t.status === 'Paused').length },
    { name: t('已完工', 'Completed'), value: mockTasks.filter(t => t.status === 'Completed').length },
  ];

  const COLORS = ['#3b82f6', '#94a3b8', '#f59e0b', '#10b981'];

  const filteredTasks = mockTasks.filter(task => 
    task.itemName.includes(searchTerm) || task.workshop.includes(searchTerm) || task.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 顶部生产指挥看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('在制工单总数', 'Total Active WOs')}</p>
          <h4 className="text-2xl font-black text-slate-900 relative z-10">{stats.total} <span className="text-xs font-normal text-slate-400">批次</span></h4>
          <div className="flex items-center gap-1 mt-2 text-blue-600 text-[10px] font-bold relative z-10">
            <Activity size={12} /> {t('资源负荷 82%', 'Current Load 82%')}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('工位综合效率 OEE', 'Overall Efficiency')}</p>
          <h4 className="text-2xl font-black text-emerald-600 relative z-10">{stats.avgEfficiency}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden relative z-10">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.avgEfficiency}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-8 bg-rose-50 rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-125 transition-transform duration-500"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{t('异常停机预警', 'Downtime Alert')}</p>
          <h4 className="text-2xl font-black text-rose-600 relative z-10">02 <span className="text-xs font-normal text-slate-400">机台</span></h4>
          <p className="text-[10px] text-rose-500 mt-2 font-bold animate-pulse relative z-10">{t('建议增加晚班人力', 'Night shift recommended')}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Zap className="text-white" size={60} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('调度引擎状态', 'Scheduler Status')}</p>
          <h4 className="text-2xl font-black text-white">{t('实时排产', 'Dynamic Sch.')}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">{t('已连接车间 MES 总线', 'Connected to MES Bus')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 负荷对比混合图 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Gauge className="text-blue-600" size={20} />
              {t('车间资源负荷与产能平衡', 'Workshop Load & Capacity Balancing')}
            </h3>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Activity size={18} /></div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name={t('实际负荷', 'Actual Load')} />
                <Area type="monotone" dataKey="capacity" fill="rgba(148, 163, 184, 0.05)" stroke="#cbd5e1" strokeDasharray="5 5" name={t('设计产能', 'Design Capacity')} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 状态分布 */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
            <Layers className="text-indigo-600" size={20} />
            {t('在制任务状态分布', 'Live Task Distribution')}
          </h3>
          <p className="text-[10px] text-slate-400 mb-6 uppercase tracking-widest">{t('基于 MES 实时反馈', 'Based on Real-time MES')} </p>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {statusDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-500 font-bold uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-slate-900 font-black">{item.value} {t('项', 'Items')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 作业计划明细工作台 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索工单号、车间或关键设备...', 'Search WO, Workshop, or Resource...')}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
              <Download size={16} /> {t('导出排产建议单', 'Export Schedule')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">{t('作业单号 / 执行车间', 'WO ID / Workshop')}</th>
                <th className="px-6 py-5">{t('部件 / 核心资源', 'Part / Resource')}</th>
                <th className="px-6 py-5 text-center">{t('流转进度', 'Process Progress')}</th>
                <th className="px-6 py-5 text-center">{t('优先级', 'Priority')}</th>
                <th className="px-6 py-5 text-center">{t('运行状态', 'Status')}</th>
                <th className="px-8 py-5 text-right">{t('最近同步', 'Last Sync')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">{task.id}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">{task.workshop}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-700">{task.itemName}</div>
                    <div className="text-[10px] text-blue-500 font-black uppercase mt-1">{task.resource}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                      <span className="text-[11px] font-black text-slate-900">{task.progress}%</span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            task.status === 'Completed' ? 'bg-emerald-500' : 
                            (task.status === 'Paused' ? 'bg-rose-500' : 'bg-blue-600')
                          }`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] font-black shadow-sm ${
                      task.priority === 'High' ? 'bg-rose-600 text-white' : 
                      (task.priority === 'Medium' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white')
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border inline-flex items-center gap-1.5 uppercase ${
                      task.status === 'Running' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      (task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      (task.status === 'Paused' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-200'))
                    }`}>
                      {task.status === 'Running' && <Activity size={10} />}
                      {task.status === 'Completed' && <CheckSquare size={10} />}
                      {task.status === 'Paused' && <Timer size={10} />}
                      {task.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-[11px] text-slate-400 font-mono font-bold">
                    {task.lastUpdate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部业务说明 */}
      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 border-dashed relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600"></div>
        <div className="flex items-start gap-4">
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Factory size={24} /></div>
           <div className="flex-1">
             <h5 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-1">{t('车间作业能力审计', 'Workshop Capacity Audit')}</h5>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-4xl">
               {t('本分析模块由 Node.js 生产逻辑处理引擎支撑，基于 MySQL 中记录的实时工序报工、设备异常停机及人员效率波动。负荷分析采用 7 天滑动窗口模型，旨在识别生产链条中的“瓶颈工序”，并为采购计划的提前量调整提供直接数据支持。', 'Analysis supported by Node.js production logic engine, based on MySQL live task logs and resource status. Load analysis uses a 7-day sliding window model to identify "bottleneck processes" and adjust procurement lead times.')}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopAnalysisView;
