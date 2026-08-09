import React from 'react';
import { Mail, ShieldAlert, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm pt-10 pb-8 text-slate-600 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          {/* Privacy Disclaimer Note */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.disclaimerTitle}</span>
            </div>
            <p className="leading-relaxed opacity-90">
              {t.disclaimerText}
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p className="font-medium">
            {t.copyright}
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Powered by mail.tm REST API</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for privacy
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};
