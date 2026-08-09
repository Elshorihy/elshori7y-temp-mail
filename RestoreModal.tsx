import React, { useState } from 'react';
import { X, KeyRound, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface RestoreModalProps {
  lang: Language;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onRestoreToken: (token: string) => void;
  onRestoreCredentials: (email: string, pass: string) => void;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({
  lang,
  isOpen,
  isLoading,
  onClose,
  onRestoreToken,
  onRestoreCredentials,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'token' | 'credentials'>('token');
  const [tokenInput, setTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال رمز الوصول' : 'Please enter bearer token.');
      return;
    }
    setError('');
    onRestoreToken(tokenInput.trim());
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email address and password.');
      return;
    }
    setError('');
    onRestoreCredentials(emailInput.trim(), passwordInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {t.restoreTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.restoreDesc}
        </p>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('token');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'token'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.tokenTab}
          </button>
          <button
            onClick={() => {
              setActiveTab('credentials');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.credentialsTab}
          </button>
        </div>

        {/* Form: Token */}
        {activeTab === 'token' && (
          <form onSubmit={handleSubmitToken} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.tokenField}
              </label>
              <textarea
                rows={3}
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setError('');
                }}
                placeholder={t.tokenPlaceholder}
                className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 resize-none"
              />
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? t.refreshing : t.restoreSubmit}
            </button>
          </form>
        )}

        {/* Form: Credentials */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleSubmitCredentials} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.addressField}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 dir-rtl:right-3 dir-rtl:left-auto text-slate-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setError('');
                  }}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-9 pr-3 dir-rtl:pr-9 dir-rtl:pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.passwordField}
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3 dir-rtl:right-3 dir-rtl:left-auto text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setError('');
                  }}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-9 pr-3 dir-rtl:pr-9 dir-rtl:pl-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? t.refreshing : t.restoreSubmit}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
