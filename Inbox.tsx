import React from 'react';
import { RefreshCw, Search, Mail, Paperclip, Trash2, Clock, Inbox as InboxIcon, AlertCircle } from 'lucide-react';
import { Language, Message } from '../types';
import { translations } from '../lib/translations';
import { formatRelativeTime } from '../lib/sanitizeHtml';

interface InboxProps {
  lang: Language;
  messages: Message[];
  isLoading: boolean;
  isExpired: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onSelectMessage: (message: Message) => void;
  onDeleteMessage: (id: string, e: React.MouseEvent) => void;
  autoRefreshCounter: number;
}

export const Inbox: React.FC<InboxProps> = ({
  lang,
  messages,
  isLoading,
  isExpired,
  searchQuery,
  onSearchChange,
  onRefresh,
  onSelectMessage,
  onDeleteMessage,
  autoRefreshCounter,
}) => {
  const t = translations[lang];

  // Filter messages by search query
  const filteredMessages = messages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.subject?.toLowerCase().includes(q) ||
      msg.from?.address?.toLowerCase().includes(q) ||
      msg.from?.name?.toLowerCase().includes(q) ||
      msg.intro?.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.seen).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Title + Unread Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <InboxIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.inboxTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {messages.length} {t.totalMessages}
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                    {unreadCount} {t.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.autoPollingIn} <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{autoRefreshCounter}{t.seconds}</span>
              </p>
            </div>
          </div>

          {/* Controls: Search & Refresh */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 dir-rtl:right-3 dir-rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 dir-rtl:pr-9 dir-rtl:pl-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading || isExpired}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700/80 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-500 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? t.refreshing : t.refreshButton}</span>
            </button>
          </div>

        </div>

        {/* Expired Notification Overlay message */}
        {isExpired && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t.expiredMessage}</span>
          </div>
        )}

        {/* Message List Section */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
          
          {/* Loading Skeletons */}
          {isLoading && messages.length === 0 && (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 animate-pulse flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State Illustration */}
          {!isLoading && filteredMessages.length === 0 && (
            <div className="py-12 px-4 text-center space-y-4">
              
              {/* Sonar Pulse Radar Effect */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                <span className="absolute inset-2 rounded-full bg-indigo-500/10 animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60 shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  {searchQuery ? t.noSearchResults : t.noMessagesTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {searchQuery ? '' : t.noMessagesDesc}
                </p>
              </div>
            </div>
          )}

          {/* Render Filtered Messages */}
          {filteredMessages.map((msg) => {
            const senderName = msg.from?.name || msg.from?.address?.split('@')[0] || 'Unknown';
            const senderInitial = senderName.charAt(0).toUpperCase();

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`group py-3.5 px-3 sm:px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 my-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                  !msg.seen
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-l-4 border-indigo-600 dark:border-indigo-500'
                    : 'bg-transparent'
                }`}
              >
                {/* Sender Avatar & Info */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${
                    !msg.seen
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {senderInitial}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm truncate ${
                        !msg.seen ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'
                      }`}>
                        {senderName}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate hidden md:inline">
                        &lt;{msg.from?.address}&gt;
                      </span>
                      {!msg.seen && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>

                    <h4 className={`text-xs sm:text-sm truncate ${
                      !msg.seen ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-normal text-slate-600 dark:text-slate-400'
                    }`}>
                      {msg.subject || '(No Subject)'}
                    </h4>

                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl">
                      {msg.intro || '(No preview content)'}
                    </p>
                  </div>
                </div>

                {/* Right Metadata: Date, Attachment, Delete */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {msg.hasAttachments && (
                    <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                  )}

                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(msg.createdAt, lang)}
                  </span>

                  <button
                    onClick={(e) => onDeleteMessage(msg.id, e)}
                    title={t.deleteMessage}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};
