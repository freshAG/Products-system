
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, Trash2, RotateCcw, Truck, Search, 
  Filter, Download, ShieldAlert, BadgeAlert, 
  UserCheck, Calendar, FileText, ArrowUpRight, 
  BarChart3, Printer, Link2
} from 'lucide-react';
import { Language, DefectNotice } from '../types';

const DefectNoticeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 模拟从后端 MySQL 数据库获取的初始数据
  const generateInitialDefects = (): DefectNotice[] => {
    const parts = [
      '轴承 Z-9', '主控芯片 IC-10', '微型马达 MT-5', '高压管路 HP-8', 
      '齿轮 A-12', '控制板 V-2', '传感器 C-0', '液压泵 H-5', '法兰盘 F-2'
    ];
    const reasons = [
      '关键尺寸超差 (Critical Dimension)', '材料成分不达标 (Material)', 
      '功能测试失效 (Functional)', '严重形变 (Deformation)', 
      '涂层脱落 (Coating)', '内部裂纹 (Crack)'
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      id: `DEF-2026-${(500 + i)}`,
      inspectId: `INS-2026-${(200 + i * 5)}`,
      itemName: parts[i % parts.length],
      failReason: reasons[i % reasons.length],
      disposal: i % 3 === 0 ? 'Return' : (i % 3 === 1 ? 'Scrap' : 'Concession'),
      handler: i % 2 === 0 ? '李高级工程师' : '张质量主管',
      date: `2026-02-${(i % 10) + 10}`.padStart(10, '0')
    }));
  };

  const [defects] = useState<DefectNotice[]>(generateInitialDefects());
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟后端聚合查询出的质量损失看板数据
  const stats = useMemo(() => {
    const total = defects.length;
    const scrapCount = defects.filter(d => d.disposal === 'Scrap').length;
    const returnCount = defects.filter(d => d.disposal === 'Return').length;
    // 假设平均报废损失 ¥25,000
    const estLoss = scrapCount * 25000;
    return { total, scrapCount, returnCount, estLoss };
  }, [defects]);

  const filteredDefects = defects.filter(d => 
    d.itemName.includes(searchTerm) || d.id.includes(searchTerm) || d.failReason.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 顶部质量事故监控 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('累计质量事故', 'Total Incidents')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><BarChart3 size={18} /></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">{t('涉及 4 个核心品类', 'Affects 4 core categories')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('本月报废件数', 'Monthly Scrap')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-rose-600">{stats.scrapCount}</h4>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><Trash2 size={18} /></div>
          </div>
          <p className="text-[10px] text-rose-400 mt-2 font-bold animate-pulse">{t('需触发管理评审', 'Management Review Req.')}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('质量损失估值', 'Est. Quality Loss')}</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-slate-900">¥{stats.estLoss.toLocaleString()}</h4>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><BadgeAlert size={18} /></div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-rose-600 text-[10px] font-bold">
             <ArrowUpRight size={12} /> {t('超出本季预算 5.2%', '5.2% Over budget')}
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><ShieldAlert className="text-white" size={40} /></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('合规审计状态', 'Compliance')}</p>
          <h4 className="text-2xl font-black text-white">{t('已闭环', 'Closed-loop')}</h4>
          <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase tracking-widest">{t('所有处置已留痕', 'All Audit Trails OK')}</p>
        </div>
      </div>

      {/* 列表控制中心 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('搜索单号、物料名称、故障原因...', 'Search ID, Item, or Reason...')}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-rose-200 hover:text-rose-600 font-bold text-sm transition-all shadow-sm">
            <Filter size={18} /> {t('多维筛选', 'Filter')}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 font-bold text-sm transition-all shadow-lg shadow-rose-200">
            <FileText size={18} /> {t('批量生成处置单', 'Generate Docs')}
          </button>
        </div>
      </div>

      {/* 数据明细表格 */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 border-b">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">{t('处置单号 / 关联质检', 'Defect ID / Inspect Ref')}</th>
                <th className="px-6 py-5">{t('不合格部件', 'Non-conforming Item')}</th>
                <th className="px-6 py-5">{t('故障详情', 'Failure Detail')}</th>
                <th className="px-6 py-5 text-center">{t('裁决处置方式', 'Disposal Method')}</th>
                <th className="px-6 py-5 text-center">{t('执行责任人', 'Handler')}</th>
                <th className="px-6 py-5 text-center">{t('操作', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map((d) => (
                <tr key={d.id} className="hover:bg-rose-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-900 font-mono tracking-tight">{d.id}</div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 uppercase">
                      <Link2 size={10} /> {d.inspectId}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{d.itemName}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono uppercase tracking-widest">
                      <Calendar size={10} /> {d.date}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-rose-600 font-medium italic border-l-2 border-rose-200 pl-3 leading-relaxed">
                      {d.failReason}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black inline-flex items-center gap-2 shadow-sm border ${
                      d.disposal === 'Return' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                      d.disposal === 'Scrap' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {d.disposal === 'Return' ? <RotateCcw size={12} /> : (d.disposal === 'Scrap' ? <Trash2 size={12} /> : <Truck size={12} />)}
                      {t(
                        d.disposal === 'Return' ? '退货 (Return)' : (d.disposal === 'Scrap' ? '报废 (Scrap)' : '让步 (Concession)'),
                        d.disposal
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <UserCheck size={12} className="text-blue-500" />
                        {d.handler}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">{t('经质量委员会授权', 'Auth By QC Comm')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-slate-300 hover:text-blue-600 transition-all hover:scale-110" title={t('打印处置单', 'Print Document')}><Printer size={18} /></button>
                      <button className="text-slate-300 hover:text-rose-600 transition-all hover:scale-110" title={t('查看原始检验报告', 'Original Report')}><FileText size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部业务警示 */}
      <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 border-dashed text-center">
        <div className="flex items-center justify-center gap-2 text-rose-600 mb-2">
          <AlertTriangle size={18} />
          <span className="text-xs font-black uppercase tracking-widest">{t('质量损失确认提示', 'Quality Loss Confirmation')}</span>
        </div>
        <p className="text-[11px] text-rose-500 font-medium leading-relaxed max-w-2xl mx-auto">
          {t('确认“报废”操作后，系统将自动核减原材料库存并生成生产损耗单；确认“退货”将自动关联供应商扣款指令。请务必核实实物证据。', 'Scrap will reduce stock and generate loss docs; Return will trigger supplier penalty. Verification required.')}
        </p>
      </div>
    </div>
  );
};

export default DefectNoticeView;
