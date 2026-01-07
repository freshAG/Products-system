
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, Download, ClipboardCheck, 
  AlertCircle, CheckCircle2, Clock, Filter, 
  UserCircle2, PackageSearch, History, Printer
} from 'lucide-react';
import { Language, InspectionRequest } from '../types';

const InspectionRequestView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialRequests = (): InspectionRequest[] => {
    const parts = [
      '齿轮 A-12', '传动轴 B-05', '密封圈 S-88', '控制板 V-2', '轴承 Z-9',
      '连接销 P-1', '液压泵 H-5', '传感器 C-0', '法兰盘 F-2', '紧固件 K-8',
      '外壳 J-3', '线束 L-9', '散热器 R-4', '阀门 G-6', '弹簧 T-1',
      '主控芯片 IC-10', '铝合金框架 FR-2', '绝缘垫片 IN-01', '微型马达 MT-5', '高压管路 HP-8', '显示模组 LCD-V2'
    ];
    return parts.map((name, i) => ({
      id: `INS-2026-${(200 + i)}`,
      noticeId: `NOTICE-SN-${(1000 + i)}`,
      supplierName: i % 2 === 0 ? `正奇机械 ${((i % 10) + 1)} 公司` : `Alpha Elec ${((i % 10) + 1)} Ltd`,
      itemName: name,
      batchNo: `BAT-${2026}${Math.floor(Math.random()*9000)+1000}`,
      requestQty: 100 + (i * 10),
      requestDate: `2026-01-${(i % 28) + 1}`.padStart(10, '0'),
      inspector: i % 3 === 0 ? '张工' : (i % 3 === 1 ? '李工' : '赵工'),
      status: i % 10 === 0 ? 'Unqualified' : (i % 5 === 0 ? 'Pending' : 'Qualified')
    }));
  };

  const [requests] = useState<InspectionRequest[]>(generateInitialRequests());
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟后端聚合查询出的质检 KPI
  const stats = useMemo(() => {
    const total = requests.length;
    const qualified = requests.filter(r => r.status === 'Qualified').length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const passRate = ((qualified / (total - pending)) * 100).toFixed(1);
    return { total, qualified, pending, passRate };
  }, [requests]);

  const filteredRequests = requests.filter(r => 
    r.itemName.includes(searchTerm) || r.id.includes(searchTerm) || r.batchNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部质检效能监控 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 text-slate-50 group-hover:scale-110 transition-transform">
            <ClipboardCheck size={80} strokeWidth={1} />
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('本月总报检', 'Total Requests')}</p>
            <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
            <div className="flex items-center gap-1 mt-2 text-blue-600 text-[10px] font-bold">
              <History size={12} /> {t('实时同步中', 'Live Syncing')}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('全厂综合合格率', 'Avg Pass Rate')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-emerald-600">{stats.passRate}%</h4>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck size={18} /></div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.passRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('待处理检验', 'Pending Inspection')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-amber-500">{stats.pending}</h4>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Clock size={18} /></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">{t('平均等待时长: 1.2h', 'Avg wait time: 1.2h')}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><PackageSearch className="text-white" size={40} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('今日判定量', 'Decisions Today')}</p>
          <h4 className="text-2xl font-black text-white">{stats.total - stats.pending}</h4>
          <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-tight tracking-widest italic">{t('质量体系运行正常', 'QA System Nominal')}</p>
        </div>
      </div>

      {/* 列表工具栏 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('快速检索请检单、批次号或物料...', 'Search ID, Batch, or Part...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-blue-200 hover:text-blue-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('多维过滤', 'Filter')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-lg shadow-blue-200">
            <ClipboardCheck size={18} /> {t('新建请检单', 'New Request')}
          </button>
        </div>
      </div>

      {/* 数据明细表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('请检单号 / 来源通知', 'Request ID / Notice')}</th>
                <th className="px-6 py-5">{t('厂商 / 报检部件', 'Vendor / Item')}</th>
                <th className="px-6 py-5 text-center">{t('批次标识', 'Batch No')}</th>
                <th className="px-6 py-5 text-center">{t('报检数量', 'Req Qty')}</th>
                <th className="px-6 py-5 text-center">{t('责任人员', 'Personnel')}</th>
                <th className="px-6 py-5 text-center">{t('当前状态', 'Status')}</th>
                <th className="px-6 py-5 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-900 font-mono tracking-tight">{r.id}</div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 uppercase">
                      <History size={10} /> {r.noticeId}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{r.supplierName}</div>
                    <div className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">{r.itemName}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-[11px] font-black text-slate-600 bg-slate-50 border border-slate-200 py-1 rounded-lg font-mono">
                      {r.batchNo}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm font-black text-blue-600">{r.requestQty}</div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{t('已到实物', 'Physical Qty')}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <UserCircle2 size={12} className="text-slate-400" />
                        {r.inspector}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 italic">{r.requestDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 shadow-sm border ${
                      r.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      r.status === 'Unqualified' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                    }`}>
                      {r.status === 'Qualified' ? <CheckCircle2 size={10} /> : (r.status === 'Unqualified' ? <AlertCircle size={10} /> : <Clock size={10} />)}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-300 hover:text-blue-600 transition-all hover:scale-110" title={t('打印质检单', 'Print Report')}><Printer size={18} /></button>
                      <button className="text-slate-300 hover:text-indigo-600 transition-all hover:scale-110" title={t('查看原始单据', 'View Source')}><History size={18} /></button>
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

export default InspectionRequestView;
