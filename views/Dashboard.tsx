
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Package, 
  ShoppingCart, AlertTriangle 
} from 'lucide-react';
import { Language } from '../types';

const Dashboard: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const stats = [
    { label: t('本月采购总额', 'Monthly Spending'), value: '¥2,840,000', change: '+12.5%', icon: <ShoppingCart className="text-blue-600" />, trend: 'up' },
    { label: t('活跃供应商', 'Active Suppliers'), value: '142', change: '+4', icon: <Users className="text-emerald-600" />, trend: 'up' },
    { label: t('库存周转率', 'Stock Turnover'), value: '85.2%', change: '-2.1%', icon: <Package className="text-orange-600" />, trend: 'down' },
    { label: t('异常品反馈', 'QC Feedback'), value: '18', change: '-5', icon: <AlertTriangle className="text-rose-600" />, trend: 'down' },
  ];

  const costData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 }, { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }, { name: 'Jun', value: 900 },
  ];

  const qualityData = [
    { name: 'S-Group A', score: 92, rate: 98 },
    { name: 'S-Group B', score: 85, rate: 95 },
    { name: 'S-Group C', score: 78, rate: 88 },
    { name: 'S-Group D', score: 95, rate: 99 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-50 rounded-xl">
                {s.icon}
              </div>
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                s.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}>
                {s.trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {s.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">{t('采购成本趋势', 'Purchasing Cost Trend')}</h3>
            <select className="text-sm border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500">
              <option>{t('最近6个月', 'Last 6 Months')}</option>
              <option>{t('最近1年', 'Last 1 Year')}</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Score Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">{t('核心供应商绩效', 'Core Supplier Performance')}</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="top" align="right" height={36}/>
                <Bar name={t('质量得分', 'Quality Score')} dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name={t('履约率%', 'Fulfillment %')} dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">{t('最新供货跟踪', 'Latest Delivery Tracking')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">{t('查看全部', 'View All')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">{t('部件名称', 'Part Name')}</th>
                <th className="px-6 py-4">{t('供应商', 'Supplier')}</th>
                <th className="px-6 py-4">{t('到货日期', 'Arrival Date')}</th>
                <th className="px-6 py-4">{t('状态', 'Status')}</th>
                <th className="px-6 py-4">{t('质量', 'Quality')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'A-1202 Gear Box', supplier: 'Zhengqi Mech', date: '2023-11-20', status: 'In Transit', quality: 'Pending' },
                { name: 'C-009 Sensor', supplier: 'Alpha Electron', date: '2023-11-19', status: 'Received', quality: 'Qualified' },
                { name: 'B-883 Hydraulic', supplier: 'PowerLine Ind', date: '2023-11-18', status: 'Delayed', quality: 'N/A' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.supplier}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      row.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 
                      row.status === 'Delayed' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-sm ${row.quality === 'Qualified' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {row.quality}
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

export default Dashboard;
