import React from 'react';
import { Mail, Moon, Sun, Languages, KeyRound, ShieldCheck, Clock } from 'lucide-react';
import { Language, InboxSession } from '../types';
import { translations } from '../lib/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  session: InboxSession | null;
  isExpired: boolean;
  onOpenRestore: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isDarkMode,
  onToggleDarkMode,
  session,
  isExpired,
  onOpenRestore,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
                {t.brandName}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                <ShieldCheck className="w-3 h-3" />
                {lang === 'ar' ? 'مؤقت وآمن' : 'Disposable'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active / Expired Status Badge */}
          {session && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <span className="relative flex h-2 w-2">
                {!isExpired && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isExpired ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {isExpired ? t.expiredBadge : t.activeBadge}
              </span>
            </div>
          )}

          {/* Restore Session Button */}
          <button
            onClick={onOpenRestore}
            title={t.restoreTooltip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">{t.restoreSession}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.toggleLanguage}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={t.toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
