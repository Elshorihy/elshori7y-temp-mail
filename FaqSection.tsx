import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Lock, MailCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t.faq1Q, a: t.faq1A, icon: Zap },
    { q: t.faq2Q, a: t.faq2A, icon: ShieldCheck },
    { q: t.faq3Q, a: t.faq3A, icon: MailCheck },
    { q: t.faq4Q, a: t.faq4A, icon: Lock },
    { q: t.faq5Q, a: t.faq5A, icon: HelpCircle },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.faqTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.faqSubtitle}
        </p>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
