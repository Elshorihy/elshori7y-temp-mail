import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Share2, Clock, Sparkles, AlertCircle, SlidersHorizontal, Layers } from 'lucide-react';
import { Language, InboxSession, Domain } from '../types';
import { translations, DURATION_OPTIONS } from '../lib/translations';

interface EmailDisplayProps {
  lang: Language;
  session: InboxSession | null;
  domains: Domain[];
  isGenerating: boolean;
  isExpired: boolean;
  onGenerateNew: () => void;
  onOpenCustomModal: () => void;
  onOpenShareModal: () => void;
  onChangeDuration: (minutes: number) => void;
  onExtendTime: () => void;
  onCopyEmail: () => void;
}

export const EmailDisplay: React.FC<EmailDisplayProps> = ({
  lang,
  session,
  domains,
  isGenerating,
  isExpired,
  onGenerateNew,
  onOpenCustomModal,
  onOpenShareModal,
  onChangeDuration,
  onExtendTime,
  onCopyEmail,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [percentLeft, setPercentLeft] = useState<number>(100);

  // Handle Copy to clipboard with toast/visual state
  const handleCopy = () => {
    if (!session?.address) return;
    navigator.clipboard.writeText(session.address);
    setCopied(true);
    onCopyEmail();
    setTimeout(() => setCopied(false), 2500);
  };

  // Timer countdown calculations
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const now = Date.now();
      const totalDurationMs = session.durationMinutes * 60 * 1000;
      const elapsedMs = now - session.createdAt;
      const remainingMs = session.expiredAt - now;

      if (remainingMs <= 0) {
        setTimeLeftStr('00:00');
        setPercentLeft(0);
        return;
      }

      const percent = Math.max(0, Math.min(100, (remainingMs / totalDurationMs) * 100));
      setPercentLeft(percent);

      const totalSeconds = Math.floor(remainingMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        setTimeLeftStr(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        setTimeLeftStr(`${mm}:${ss}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Hero Header */}
      <div className="text-center space-y-2 pt-2 pb-1">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.tagline}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
          {t.subtitle}
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        
        {/* Subtle Background Accent Gradient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          
          {/* Label + Duration Timer Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>{t.temporaryEmailLabel}</span>
            </div>

            {/* Countdown Badge */}
            {session && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isExpired
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{t.expiresIn}</span>
                <span className="text-sm font-bold">{timeLeftStr}</span>
              </div>
            )}
          </div>

          {/* Email Address Display Box + Copy Button */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
              
              <input
                type="text"
                readOnly
                value={session?.address || (isGenerating ? t.generating : '')}
                className="w-full px-4 py-3.5 text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-slate-100 bg-transparent outline-none select-all tracking-tight"
                placeholder={isGenerating ? t.generating : 'Loading temporary email...'}
              />

              {/* Status Indicator inside Input */}
              <div className="px-3 flex items-center">
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                ) : isExpired ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-white font-sans font-bold">
                    {t.expiredBadge}
                  </span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={!session || isGenerating}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
                copied
                  ? 'bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>{t.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>{t.copyButton}</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar for Expiry */}
          {session && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  isExpired
                    ? 'bg-amber-500'
                    : percentLeft < 20
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${percentLeft}%` }}
              />
            </div>
          )}

          {/* Actions Bar: Generate New, Customize, Share */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              
              {/* Generate New Email Button */}
              <button
                onClick={onGenerateNew}
                disabled={isGenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all border border-indigo-200/80 dark:border-indigo-800/80 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{t.generateNew}</span>
              </button>

              {/* Customize Prefix Button */}
              <button
                onClick={onOpenCustomModal}
                disabled={isGenerating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                <span>{t.customPrefix}</span>
              </button>
            </div>

            {/* Share / Save Credentials Button */}
            <button
              onClick={onOpenShareModal}
              disabled={!session}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80"
            >
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span>{t.shareSave}</span>
            </button>
          </div>

          {/* Active Duration Selector Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t.selectDuration}
              </span>
              {isExpired && (
                <button
                  onClick={onExtendTime}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {t.extendTime}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = session?.durationMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    onClick={() => onChangeDuration(opt.minutes)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    {lang === 'ar' ? opt.labelAr : opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expired Warning Banner */}
          {isExpired && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{t.expiredMessage}</p>
              </div>
              <button
                onClick={onGenerateNew}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
              >
                {t.generateNew}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
