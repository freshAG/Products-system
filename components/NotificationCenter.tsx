
import React from 'react';
import { 
  X, AlertTriangle, AlertCircle, Info, CheckCircle, 
  Settings, Trash2, ExternalLink, Package, ShieldAlert, Clock
} from 'lucide-react';
import { Language } from '../types';
import { AppNotification } from '../App';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  lang: Language;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, onClose, notifications, lang, onMarkAsRead, onClearAll 
}) => {
  if (!isOpen) return null;

  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const getIcon = (type: string, category: string) => {
    if (category === 'stock') return <Package size={16} className="text-amber-500" />;
    if (category === 'quality') return <ShieldAlert size={16} className="text-rose-500" />;
    if (category === 'delivery') return <Clock size={16} className="text-rose-500" />;
    
    switch (type) {
      case 'error': return <AlertCircle size={16} className="text-rose-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-rose-50';
      case 'warning': return 'bg-amber-50';
      case 'success': return 'bg-emerald-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-scaleUp">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800">{t('通知中心', 'Notifications')}</h3>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-black">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClearAll}
              className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {t('全部已读', 'Mark all read')}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!n.read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => onMarkAsRead(n.id)}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-xl h-fit ${getBgColor(n.type)}`}>
                      {getIcon(n.type, n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`text-xs font-black truncate pr-4 ${!n.read ? 'text-slate-900' : 'text-slate-500'}`}>
                          {lang === 'zh' ? n.title : n.titleEn}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed mb-2 ${!n.read ? 'text-slate-700' : 'text-slate-400'}`}>
                        {lang === 'zh' ? n.message : n.messageEn}
                      </p>
                      <div className="flex items-center gap-3">
                        <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                          <ExternalLink size={10} />
                          {t('查看详情', 'View Details')}
                        </button>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <CheckCircle size={32} className="mb-2 opacity-20" />
              <p className="text-xs">{t('暂无新通知', 'No new notifications')}</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all uppercase tracking-widest shadow-sm">
            {t('查看所有历史通知', 'View full history')}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
