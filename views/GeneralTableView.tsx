
import React from 'react';
import { Search, Plus, Filter, Download, MoreVertical } from 'lucide-react';
import { Language } from '../types';

const GeneralTableView: React.FC<{ title: string; lang: Language }> = ({ title, lang }) => {
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
            <Download size={16} />
            {t('导出报表', 'Export Report')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200 font-medium text-sm">
            <Plus size={16} />
            {t('新增记录', 'Add Entry')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('快速搜索...', 'Quick search...')}
              className="pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"><Filter size={18} /></button>
        </div>

        <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <Search size={32} />
          </div>
          <p className="text-sm font-medium">{t('未找到相关数据，请尝试调整搜索条件。', 'No data found. Try adjusting your search.')}</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralTableView;
