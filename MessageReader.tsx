import React, { useState, useEffect } from 'react';
import { X, Trash2, Printer, Download, Copy, Check, FileText, Code, Paperclip, Mail, Clock, ExternalLink } from 'lucide-react';
import { Language, MessageDetail } from '../types';
import { translations } from '../lib/translations';
import { sanitizeHtmlContent, formatRelativeTime } from '../lib/sanitizeHtml';

interface MessageReaderProps {
  lang: Language;
  message: MessageDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const MessageReader: React.FC<MessageReaderProps> = ({
  lang,
  message,
  isLoading,
  onClose,
  onDelete,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'attachments' | 'headers'>('html');
  const [copiedText, setCopiedText] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!message && !isLoading) return null;

  // Render HTML safely
  const htmlContent = message?.html?.[0] || '';
  const sanitizedHtml = sanitizeHtmlContent(htmlContent);
  const textContent = message?.text || message?.intro || '';

  const handleCopyBody = () => {
    const content = textContent || htmlContent;
    navigator.clipboard.writeText(content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/50">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {message?.subject || '(No Subject)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t.from} <span className="font-semibold text-slate-700 dark:text-slate-300">{message?.from?.name || message?.from?.address}</span>
              </p>
            </div>
          </div>

          {/* Action Tools & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyBody}
              title="Copy Text"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              title="Print"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <Printer className="w-4 h-4" />
            </button>

            {message && (
              <button
                onClick={() => {
                  onDelete(message.id);
                  onClose();
                }}
                title={t.deleteMessage}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              title={t.closeReader}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Loading message content...
            </p>
          </div>
        )}

        {/* Message Content Body */}
        {message && !isLoading && (
          <>
            {/* Metadata Info Panel */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400">{t.from}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{message.from?.name}</span>
                  <span className="text-slate-500 font-mono">&lt;{message.from?.address}&gt;</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatRelativeTime(message.createdAt, lang)}</span>
                </div>
              </div>

              {message.to && message.to.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400">{t.to}</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">
                    {message.to.map((t) => t.address).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'html'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{t.htmlTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'text'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.textTab}</span>
              </button>

              {message.attachments && message.attachments.length > 0 && (
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'attachments'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{t.attachmentsTab} ({message.attachments.length})</span>
                </button>
              )}
            </div>

            {/* Main Viewer Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-[300px]">
              
              {/* HTML Tab */}
              {activeTab === 'html' && (
                sanitizedHtml ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    {t.noHtmlContent}
                  </div>
                )
              )}

              {/* Text Tab */}
              {activeTab === 'text' && (
                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                  {textContent || t.noTextContent}
                </pre>
              )}

              {/* Attachments Tab */}
              {activeTab === 'attachments' && (
                <div className="space-y-3">
                  {message.attachments?.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Paperclip className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {att.filename}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {(att.size / 1024).toFixed(1)} KB • {att.contentType}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`https://api.mail.tm${att.downloadUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.downloadAttachment}</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
