import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { EmailDisplay } from './components/EmailDisplay';
import { Inbox } from './components/Inbox';
import { MessageReader } from './components/MessageReader';
import { CustomEmailModal } from './components/CustomEmailModal';
import { ShareSaveModal } from './components/ShareSaveModal';
import { RestoreModal } from './components/RestoreModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { Language, InboxSession, Domain, Message, MessageDetail, ToastMessage } from './types';
import {
  getDomains,
  createAccount,
  getToken,
  getMessages,
  getMessage,
  deleteMessage,
  generateRandomUsername,
  generateSecurePassword,
  MailApiError,
} from './lib/mailApi';
import { translations } from './lib/translations';

const STORAGE_SESSION_KEY = 'elshori7y_session_v2';
const STORAGE_LANG_KEY = 'elshori7y_lang';
const STORAGE_THEME_KEY = 'elshori7y_theme';
const DEFAULT_DURATION_MINUTES = 60; // 1 Hour

export default function App() {
  // Language & Theme
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    return saved === 'en' ? 'en' : 'ar';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Session & Domains State
  const [session, setSession] = useState<InboxSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [domains, setDomains] = useState<Domain[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);

  // Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Polling Ticker
  const [autoRefreshCounter, setAutoRefreshCounter] = useState<number>(12);
  const previousMessageCountRef = useRef<number>(0);

  const t = translations[lang];

  // Sync RTL / HTML attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  }, [lang]);

  // Sync Dark / Light Mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Save session to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [session]);

  // Toast Helper
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check if current session is expired
  const isSessionExpired = useCallback((sess: InboxSession | null): boolean => {
    if (!sess) return true;
    return Date.now() >= sess.expiredAt;
  }, []);

  const isExpired = isSessionExpired(session);

  // Fetch Available Domains
  const fetchDomains = useCallback(async () => {
    try {
      const activeDomains = await getDomains();
      if (activeDomains.length > 0) {
        setDomains(activeDomains);
        return activeDomains;
      }
    } catch (err) {
      console.error('Error fetching domains:', err);
    }
    return [];
  }, []);

  // Fetch Messages for current session
  const fetchInbox = useCallback(async (currentSession: InboxSession | null, silent: boolean = false) => {
    if (!currentSession || !currentSession.token) return;
    if (isSessionExpired(currentSession)) return;

    if (!silent) setIsLoadingMessages(true);

    try {
      const msgList = await getMessages(currentSession.token);
      
      // Check for new incoming messages
      if (msgList.length > previousMessageCountRef.current && previousMessageCountRef.current !== 0) {
        addToast(t.newMessageReceived, 'success');
        // Play notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}
      }

      previousMessageCountRef.current = msgList.length;
      setMessages(msgList);
    } catch (err) {
      if (err instanceof MailApiError) {
        if (err.status === 429) {
          if (!silent) addToast(t.rateLimitError, 'warning');
        } else if (err.status === 401) {
          // Token expired or invalid
          setSession(null);
        }
      }
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  }, [isSessionExpired, addToast, t.newMessageReceived, t.rateLimitError]);

  // Generate a New Temporary Email
  const createNewEmail = useCallback(async (customPrefix?: string, chosenDomain?: string) => {
    setIsGenerating(true);
    setMessages([]);
    previousMessageCountRef.current = 0;

    try {
      let activeDomains = domains;
      if (activeDomains.length === 0) {
        activeDomains = await fetchDomains();
      }

      if (activeDomains.length === 0) {
        addToast(t.domainError, 'error');
        setIsGenerating(false);
        return;
      }

      const domainObj = chosenDomain
        ? activeDomains.find((d) => d.domain === chosenDomain) || activeDomains[0]
        : activeDomains[0];

      const prefix = customPrefix || generateRandomUsername(8);
      const emailAddress = `${prefix}@${domainObj.domain}`;
      const password = generateSecurePassword();

      // 1. Create Account
      const account = await createAccount(emailAddress, password);

      // 2. Get Token
      const tokenResp = await getToken(emailAddress, password);

      const now = Date.now();
      const newSession: InboxSession = {
        id: account.id,
        address: emailAddress,
        password,
        token: tokenResp.token,
        accountId: account.id,
        createdAt: now,
        durationMinutes: DEFAULT_DURATION_MINUTES,
        expiredAt: now + DEFAULT_DURATION_MINUTES * 60 * 1000,
        selectedDomain: domainObj.domain,
      };

      setSession(newSession);
      addToast(t.newEmailGenerated, 'success');
      setIsCustomModalOpen(false);

      // Initial inbox fetch
      fetchInbox(newSession, false);
    } catch (err) {
      console.error('Error generating email:', err);
      if (err instanceof MailApiError && err.status === 429) {
        addToast(t.rateLimitError, 'error');
      } else {
        addToast(t.createAccountError, 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [domains, fetchDomains, addToast, t.domainError, t.newEmailGenerated, t.rateLimitError, t.createAccountError, fetchInbox]);

  // Initial Load & Auto-Generation
  useEffect(() => {
    fetchDomains();

    if (!session || isSessionExpired(session)) {
      createNewEmail();
    } else {
      fetchInbox(session, false);
    }
  }, []); // Run once on mount

  // Polling Ticker Effect (Every 12s)
  useEffect(() => {
    if (!session || isExpired) return;

    const interval = setInterval(() => {
      setAutoRefreshCounter((prev) => {
        if (prev <= 1) {
          fetchInbox(session, true);
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isExpired, fetchInbox]);

  // Change Duration
  const handleChangeDuration = (minutes: number) => {
    if (!session) return;
    const now = Date.now();
    const updatedSession: InboxSession = {
      ...session,
      durationMinutes: minutes,
      expiredAt: now + minutes * 60 * 1000,
    };
    setSession(updatedSession);
  };

  // Extend Duration
  const handleExtendTime = () => {
    if (!session) return;
    const now = Date.now();
    const extraMinutes = session.durationMinutes || 60;
    const updatedSession: InboxSession = {
      ...session,
      expiredAt: now + extraMinutes * 60 * 1000,
    };
    setSession(updatedSession);
    addToast(lang === 'ar' ? 'تم تمديد صلاحية البريد بنجاح' : 'Duration extended successfully', 'success');
  };

  // Select & View Email Detail
  const handleSelectMessage = async (msg: Message) => {
    if (!session?.token) return;
    setIsLoadingDetail(true);

    try {
      const detail = await getMessage(session.token, msg.id);
      setSelectedMessage(detail);

      // Mark as seen in local state list
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, seen: true } : m))
      );
    } catch (err) {
      addToast(lang === 'ar' ? 'تعذر جلب تفاصيل الرسالة' : 'Could not fetch message details', 'error');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Delete Single Message
  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!session?.token) return;

    try {
      await deleteMessage(session.token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      addToast(t.deleteMsgSuccess, 'info');
    } catch {
      addToast(lang === 'ar' ? 'فشل حذف الرسالة' : 'Failed to delete message', 'error');
    }
  };

  // Restore Session Handlers
  const handleRestoreToken = async (tokenInput: string) => {
    setIsRestoring(true);
    try {
      const msgList = await getMessages(tokenInput);
      const now = Date.now();
      
      const restoredSession: InboxSession = {
        id: Math.random().toString(36).substring(2),
        address: 'Restored Inbox',
        password: '***',
        token: tokenInput,
        accountId: '',
        createdAt: now,
        durationMinutes: 120,
        expiredAt: now + 120 * 60 * 1000,
        selectedDomain: 'mail.tm',
      };

      setSession(restoredSession);
      setMessages(msgList);
      setIsRestoreModalOpen(false);
      addToast(t.restoreSuccess, 'success');
    } catch {
      addToast(t.restoreFailed, 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleRestoreCredentials = async (emailInput: string, passwordInput: string) => {
    setIsRestoring(true);
    try {
      const tokenResp = await getToken(emailInput, passwordInput);
      const msgList = await getMessages(tokenResp.token);
      const now = Date.now();

      const restoredSession: InboxSession = {
        id: tokenResp.id || Math.random().toString(36).substring(2),
        address: emailInput,
        password: passwordInput,
        token: tokenResp.token,
        accountId: tokenResp.id || '',
        createdAt: now,
        durationMinutes: 120,
        expiredAt: now + 120 * 60 * 1000,
        selectedDomain: emailInput.split('@')[1] || 'mail.tm',
      };

      setSession(restoredSession);
      setMessages(msgList);
      setIsRestoreModalOpen(false);
      addToast(t.restoreSuccess, 'success');
    } catch {
      addToast(t.restoreFailed, 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sticky Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        session={session}
        isExpired={isExpired}
        onOpenRestore={() => setIsRestoreModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Email Address Display Box */}
        <EmailDisplay
          lang={lang}
          session={session}
          domains={domains}
          isGenerating={isGenerating}
          isExpired={isExpired}
          onGenerateNew={() => createNewEmail()}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onChangeDuration={handleChangeDuration}
          onExtendTime={handleExtendTime}
          onCopyEmail={() => addToast(t.copiedToast, 'success')}
        />

        {/* Inbox Message List Section */}
        <Inbox
          lang={lang}
          messages={messages}
          isLoading={isLoadingMessages}
          isExpired={isExpired}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={() => {
            fetchInbox(session, false);
            setAutoRefreshCounter(12);
            addToast(t.inboxRefreshed, 'info');
          }}
          onSelectMessage={handleSelectMessage}
          onDeleteMessage={handleDeleteMessage}
          autoRefreshCounter={autoRefreshCounter}
        />

        {/* FAQ & About Section */}
        <FaqSection lang={lang} />

      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Modals */}
      <MessageReader
        lang={lang}
        message={selectedMessage}
        isLoading={isLoadingDetail}
        onClose={() => setSelectedMessage(null)}
        onDelete={(id) => handleDeleteMessage(id)}
      />

      <CustomEmailModal
        lang={lang}
        isOpen={isCustomModalOpen}
        domains={domains}
        isLoading={isGenerating}
        onClose={() => setIsCustomModalOpen(false)}
        onCreateCustom={(user, dom) => createNewEmail(user, dom)}
      />

      <ShareSaveModal
        lang={lang}
        isOpen={isShareModalOpen}
        session={session}
        onClose={() => setIsShareModalOpen(false)}
        onCopied={() => addToast(t.copiedCredentialsToast, 'success')}
      />

      <RestoreModal
        lang={lang}
        isOpen={isRestoreModalOpen}
        isLoading={isRestoring}
        onClose={() => setIsRestoreModalOpen(false)}
        onRestoreToken={handleRestoreToken}
        onRestoreCredentials={handleRestoreCredentials}
      />

      {/* Floating Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
