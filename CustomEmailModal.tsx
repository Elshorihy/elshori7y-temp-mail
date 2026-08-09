import React, { useState } from 'react';
import { X, Sparkles, AtSign } from 'lucide-react';
import { Language, Domain } from '../types';
import { translations } from '../lib/translations';

interface CustomEmailModalProps {
  lang: Language;
  isOpen: boolean;
  domains: Domain[];
  isLoading: boolean;
  onClose: () => void;
  onCreateCustom: (username: string, domain: string) => void;
}

export const CustomEmailModal: React.FC<CustomEmailModalProps> = ({
  lang,
  isOpen,
  domains,
  isLoading,
  onClose,
  onCreateCustom,
}) => {
  const t = translations[lang];
  const [username, setUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]?.domain || '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

    if (!cleanUser || cleanUser.length < 3) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسم مستخدم متوافق لا يقل عن 3 أحرف' : 'Username must be at least 3 alphanumeric characters.');
      return;
    }

    const domainToUse = selectedDomain || domains[0]?.domain;
    if (!domainToUse) {
      setErrorMsg(lang === 'ar' ? 'لا توجد نطاقات متاحة حالياً' : 'No available domains found.');
      return;
    }

    onCreateCustom(cleanUser, domainToUse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {t.customTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Custom Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.customTitle}
            </label>
            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 absolute left-3 dir-rtl:right-3 dir-rtl:left-auto text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={t.customUsernamePlaceholder}
                className="w-full pl-9 pr-3 dir-rtl:pr-9 dir-rtl:pl-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Domain Picker Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.selectDomain}
            </label>
            <select
              value={selectedDomain || domains[0]?.domain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 font-mono text-slate-900 dark:text-slate-100"
            >
              {domains.map((d) => (
                <option key={d.id} value={d.domain}>
                  @{d.domain}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? t.generating : t.createAddressBtn}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
