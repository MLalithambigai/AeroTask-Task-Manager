import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/30',
    error: 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/30',
    info: 'bg-slate-900/95 border-slate-700/50 text-slate-200 shadow-slate-950/50',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-slate-400 shrink-0" />,
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 scale-100 ${bgColors[type]}`}
      style={{ animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {icons[type]}
      <p className="text-sm font-medium tracking-wide">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white/90 transition-colors shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
