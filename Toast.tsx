import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 dir-rtl:left-5 dir-rtl:right-auto z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900';
        let Icon = CheckCircle2;

        if (toast.type === 'error') {
          bgClass = 'bg-rose-600 text-white shadow-rose-600/30';
          Icon = AlertCircle;
        } else if (toast.type === 'success') {
          bgClass = 'bg-emerald-600 text-white shadow-emerald-600/30';
          Icon = CheckCircle2;
        } else if (toast.type === 'info') {
          bgClass = 'bg-indigo-600 text-white shadow-indigo-600/30';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-slide-up transition-all ${bgClass}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                {toast.title && <p className="font-bold text-xs leading-none mb-0.5">{toast.title}</p>}
                <p className="truncate">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
