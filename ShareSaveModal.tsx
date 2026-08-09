import React, { useState } from 'react';
import { X, Copy, Check, Download, Share2, Shield, Key } from 'lucide-react';
import { Language, InboxSession } from '../types';
import { translations } from '../lib/translations';

interface ShareSaveModalProps {
  lang: Language;
  isOpen: boolean;
  session: InboxSession | null;
  onClose: () => void;
  onCopied: () => void;
}

export const ShareSaveModal: React.FC<ShareSaveModalProps> = ({
  lang,
  isOpen,
  session,
  onClose,
  onCopied,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  if (!isOpen || !session) return null;

  const expiryDate = new Date(session.expiredAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');

  const summaryText = `------------------------------------
${t.brandName} - Temporary Inbox Credentials
------------------------------------
Email: ${session.address}
Password: ${session.password}
Bearer Token: ${session.token}
Expires At: ${expiryDate}
------------------------------------`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    onCopied();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([summaryText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Elshori7y_${session.address.split('@')[0]}_credentials.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {t.shareTitle}
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
          {t.shareDesc}
        </p>

        {/* Display Fields */}
        <div className="space-y-3 font-mono text-xs">
          
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-sans font-bold text-slate-500">{t.addressField}</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 select-all">{session.address}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-sans font-bold text-slate-500">{t.passwordField}</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 select-all">{session.password}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-sans font-bold text-slate-500">{t.tokenField}</span>
            <p className="font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate select-all">{session.token}</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copiedText : t.copyCredentials}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>{t.downloadTxt}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
