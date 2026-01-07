
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { 
  Factory, LayoutDashboard, Cpu, Clock, AlertCircle, 
  Search, Download, Filter, Gauge, CheckSquare, Layers
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

  const stats = useMemo(() => {
    const total = mockTasks.length;
    const running = mockTasks.filter(t => t.status === 'Running').length;
    const completed = mockTasks.filter(t => t.status === 'Completed').length;
    const avgEfficiency = 88.5; // Fixed mock efficiency
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Factory className="text-blue-600" />
            {t('车间作业计划分析 (21)', 'Workshop Planning Analytics (21)')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('跨车间资源负载与生产令实时执行监控', 'Cross-workshop resource load and execution monitoring')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">
            <Download size={14} /> {t('导出排产报告', 'Export Schedule')}
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('在制订单总数', 'Total Active WOs')}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <Gauge size={10} className="text-blue-500" />
            {t('当前资源负荷 82%', 'Current Load 82%')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('作业执行率', 'Execution Efficiency')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckSquare size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-emerald-600">{stats.avgEfficiency}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.avgEfficiency}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('运行中机台', 'Active Resources')}</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Cpu size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-indigo-600">{stats.running} / 12</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('4 台处于预检维护', '4 under maintenance')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('今日计划缺口', 'Today\'s Gap')}</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Clock size={16} /></div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">3 {t('小时', 'Hrs')}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{t('建议增加晚班人力', 'Night shift recommended')}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Gauge size={16} className="text-blue-500" />
            {t('车间资源负荷对比', 'Workshop Resource Load')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} name={t('当前负荷', 'Current Load')} />
                <Area type="monotone" dataKey="capacity" fill="rgba(148, 163, 184, 0.1)" stroke="#cbd5e1" strokeDasharray="5 5" name={t('设计产能', 'Design Capacity')} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6">{t('作业状态分布', 'Task Status Breakdown')}</h3>
          <div className="flex h-64 items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4 pl-8">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900">{item.value} {t('项', 'Items')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('搜索作业号、车间、部件...', 'Search WO, Workshop, Part...')}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border rounded-lg hover:bg-slate-50">
            <Filter size={14} /> {t('筛选条件', 'Filters')}
          </button>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">{t('作业单号/车间', 'WO ID / Workshop')}</th>
                <th className="px-6 py-4">{t('部件/资源', 'Item / Resource')}</th>
                <th className="px-6 py-4 text-center">{t('执行进度', 'Progress')}</th>
                <th className="px-6 py-4 text-center">{t('优先级', 'Priority')}</th>
                <th className="px-6 py-4 text-center">{t('状态', 'Status')}</th>
                <th className="px-6 py-4 text-right">{t('更新日期', 'Last Updated')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900">{task.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{task.workshop}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{task.itemName}</div>
                    <div className="text-[10px] text-slate-400">{t('核心资源', 'Resource')}: {task.resource}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                      <span className="text-[10px] font-bold text-slate-500">{task.progress}%</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.status === 'Completed' ? 'bg-emerald-500' : (task.status === 'Paused' ? 'bg-amber-500' : 'bg-blue-600')}`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                      (task.priority === 'Medium' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500')
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 mx-auto max-w-[80px] ${
                      task.status === 'Running' ? 'bg-blue-100 text-blue-700' : 
                      (task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                      (task.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'))
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[11px] text-slate-400 font-mono">
                    {task.lastUpdate}
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

export default WorkshopAnalysisView;
