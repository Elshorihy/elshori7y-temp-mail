import { DurationOption } from '../types';

export const DURATION_OPTIONS: DurationOption[] = [
  { minutes: 10, labelEn: '10 Minutes', labelAr: '10 دقائق' },
  { minutes: 60, labelEn: '1 Hour', labelAr: 'ساعة واحدة' },
  { minutes: 120, labelEn: '2 Hours', labelAr: 'ساعتان' },
  { minutes: 1440, labelEn: '1 Day', labelAr: 'يوم واحد' },
  { minutes: 2880, labelEn: '2 Days', labelAr: 'يومان' },
  { minutes: 7200, labelEn: '5 Days', labelAr: '5 أيام' },
];

export const translations = {
  en: {
    // Brand
    brandName: 'Elshori7y',
    tagline: 'Instant, Secure Temporary Email',
    subtitle: 'Protect your real email inbox from spam, scams, and unwanted newsletters. Disposable temporary email in one click.',

    // Header
    activeInbox: 'Active Email',
    expiredInbox: 'Inbox Expired',
    restoreSession: 'Restore Session',
    restoreTooltip: 'Restore a saved inbox using credentials or token',
    toggleLanguage: 'العربية',
    toggleTheme: 'Toggle theme',

    // Email Display
    temporaryEmailLabel: 'Your Temporary Email Address',
    copyButton: 'Copy',
    copiedText: 'Copied!',
    generateNew: 'Generate New Email',
    generating: 'Generating...',
    customPrefix: 'Customize Name',
    domainLabel: 'Domain',
    shareSave: 'Share / Save',
    expiresIn: 'Expires in:',
    expiredMessage: 'This email address has expired visually. Generate a new email or extend duration.',
    extendTime: 'Extend Duration',
    expiredBadge: 'Expired',
    activeBadge: 'Active',
    selectDuration: 'Select active duration:',

    // Custom Username Modal
    customTitle: 'Create Custom Temporary Address',
    customUsernamePlaceholder: 'e.g. john.doe',
    selectDomain: 'Select Available Domain',
    createAddressBtn: 'Create Custom Email',
    cancel: 'Cancel',

    // Inbox
    inboxTitle: 'Your Inbox',
    refreshButton: 'Refresh',
    refreshing: 'Refreshing...',
    autoPollingIn: 'Auto refresh in',
    seconds: 's',
    totalMessages: 'messages',
    unreadCount: 'unread',
    searchPlaceholder: 'Search sender or subject...',
    noMessagesTitle: 'Waiting for incoming messages...',
    noMessagesDesc: 'Send an email to the address above. Messages will automatically appear here within seconds.',
    noSearchResults: 'No messages matched your search query.',
    receivedTime: 'Received',
    justNow: 'Just now',
    ago: 'ago',

    // Message Reader
    from: 'From:',
    to: 'To:',
    date: 'Date:',
    subject: 'Subject:',
    htmlTab: 'Rendered HTML',
    textTab: 'Plain Text',
    attachmentsTab: 'Attachments',
    headersTab: 'Headers / Raw',
    downloadAttachment: 'Download',
    deleteMessage: 'Delete Message',
    closeReader: 'Close',
    noHtmlContent: 'No HTML preview available for this message.',
    noTextContent: 'No plain text content provided.',
    
    // Share / Save Modal
    shareTitle: 'Share or Save Inbox Access',
    shareDesc: 'Copy or save these credentials to restore access to this temporary inbox later or on another device.',
    copyCredentials: 'Copy Summary Text',
    downloadTxt: 'Download as .txt Note',
    addressField: 'Email Address',
    passwordField: 'Account Password',
    tokenField: 'Bearer Token',
    expiresAtField: 'Expires At',

    // Restore Modal
    restoreTitle: 'Restore Temporary Inbox',
    restoreDesc: 'Paste your saved Bearer token or email address and password below to reload your inbox.',
    tokenTab: 'By Bearer Token',
    credentialsTab: 'By Email & Password',
    tokenPlaceholder: 'Paste mail.tm bearer token here...',
    emailPlaceholder: 'email@domain.com',
    passwordPlaceholder: 'Account password',
    restoreSubmit: 'Restore Inbox',

    // FAQ Section
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about Elshori7y disposable email',
    faq1Q: 'What is a temporary email service?',
    faq1A: 'A temporary (disposable) email service provides a working email address for a short time to receive verification codes, confirmation links, or test accounts without revealing your personal email address.',
    faq2Q: 'How long do emails stay active?',
    faq2A: 'You can choose a visual active duration from 10 minutes up to 5 days. You can also save your account token/credentials to restore access anytime.',
    faq3Q: 'Is Elshori7y free to use?',
    faq3A: 'Yes! Elshori7y is 100% free with no registration required. An email is created automatically when you visit.',
    faq4Q: 'Can I send emails from this temporary address?',
    faq4A: 'No. Temporary email services are designed strictly for receiving messages to protect your privacy and prevent spam distribution.',
    faq5Q: 'Is my privacy protected?',
    faq5A: 'Yes. Emails are public and temporary. Please do not use temporary email services for sensitive financial, health, or critical security accounts.',

    // Footer
    footerDesc: 'Elshori7y offers fast, reliable, and privacy-first temporary email addresses powered by mail.tm API.',
    disclaimerTitle: 'Privacy Disclaimer',
    disclaimerText: 'Temporary emails are disposable and public. Do not use for important or sensitive accounts (e.g. banking, medical, primary social media). All data is subject to public lifecycle limits.',
    copyright: '© 2026 Elshori7y. All rights reserved.',

    // Notifications & Errors
    copiedToast: 'Copied email address to clipboard!',
    copiedCredentialsToast: 'Credentials summary copied to clipboard!',
    newEmailGenerated: 'New temporary email created successfully!',
    inboxRefreshed: 'Inbox refreshed successfully!',
    newMessageReceived: 'New email received!',
    errorTitle: 'Error Occurred',
    rateLimitError: 'Rate limit hit. Waiting 10 seconds before retrying...',
    networkError: 'Network connection issue. Please check your internet connection.',
    domainError: 'Could not fetch available domains. Retrying shortly...',
    createAccountError: 'Failed to create temporary account. Please try generating again.',
    restoreSuccess: 'Inbox session restored successfully!',
    restoreFailed: 'Failed to restore session. Please check your token/credentials.',
    deleteMsgSuccess: 'Message deleted successfully',
  },
  ar: {
    // Brand
    brandName: 'الشريحي',
    tagline: 'بريد إلكتروني مؤقت آمن وفوري',
    subtitle: 'احمِ صندوق بريدك الحقيقي من الرسائل المزعجة (Spam) والاحتيال. بريد مؤقت بضغطة زر واحدة.',

    // Header
    activeInbox: 'البريد النشط',
    expiredInbox: 'البريد منتهي',
    restoreSession: 'استعادة جلسة',
    restoreTooltip: 'استعادة بريد سابق باستخدام الرمز أو بيانات الدخول',
    toggleLanguage: 'English',
    toggleTheme: 'تغيير المظهر',

    // Email Display
    temporaryEmailLabel: 'عنوان بريدك الإلكتروني المؤقت',
    copyButton: 'نسخ',
    copiedText: 'تم النسخ!',
    generateNew: 'إنشاء بريد جديد',
    generating: 'جاري الإنشاء...',
    customPrefix: 'تخصيص الاسم',
    domainLabel: 'النطاق',
    shareSave: 'مشاركة / حفظ',
    expiresIn: 'ينتهي خلال:',
    expiredMessage: 'انتهت صلاحية هذا البريد المؤقت. يمكنك إنشاء بريد جديد أو تمديد الصلاحية.',
    extendTime: 'تمديد الصلاحية',
    expiredBadge: 'منتهي',
    activeBadge: 'نشط',
    selectDuration: 'اختر مدة صلاحية البريد:',

    // Custom Username Modal
    customTitle: 'إنشاء بريد مؤقت مخصص',
    customUsernamePlaceholder: 'مثال: john.doe',
    selectDomain: 'اختر النطاق المتاح',
    createAddressBtn: 'إنشاء البريد المخصص',
    cancel: 'إلغاء',

    // Inbox
    inboxTitle: 'صندوق الوارد',
    refreshButton: 'تحديث',
    refreshing: 'جاري التحديث...',
    autoPollingIn: 'تحديث تلقائي خلال',
    seconds: 'ثانية',
    totalMessages: 'رسائل',
    unreadCount: 'غير مقروءة',
    searchPlaceholder: 'البحث عن مرسل أو موضوع...',
    noMessagesTitle: 'في انتظار وصول الرسائل...',
    noMessagesDesc: 'أرسل بريداً إلى العنوان أعلاه. ستظهر الرسائل تلقائياً هنا خلال ثوانٍ معدودة.',
    noSearchResults: 'لم يتم العثور على رسائل تطابق بحثك.',
    receivedTime: 'وصلت',
    justNow: 'الآن',
    ago: 'منذ',

    // Message Reader
    from: 'من:',
    to: 'إلى:',
    date: 'التاريخ:',
    subject: 'الموضوع:',
    htmlTab: 'معاينة HTML',
    textTab: 'النص المجرد',
    attachmentsTab: 'المرفقات',
    headersTab: 'الترويسة والبيانات',
    downloadAttachment: 'تنزيل',
    deleteMessage: 'حذف الرسالة',
    closeReader: 'إغلاق',
    noHtmlContent: 'لا توجد معاينة HTML لهذه الرسالة.',
    noTextContent: 'لا يوجد محتوى نصي مجرد.',

    // Share / Save Modal
    shareTitle: 'مشاركة أو حفظ بيانات البريد',
    shareDesc: 'انسخ أو احفظ هذه البيانات لاستعادة الوصول إلى هذا البريد المؤقت لاحقاً أو من جهاز آخر.',
    copyCredentials: 'نسخ نص ملخص البيانات',
    downloadTxt: 'تنزيل كملاحظة نصية .txt',
    addressField: 'عنوان البريد',
    passwordField: 'كلمة مرور الحساب',
    tokenField: 'رمز الوصول (Bearer Token)',
    expiresAtField: 'تاريخ الانتهاء',

    // Restore Modal
    restoreTitle: 'استعادة بريد مؤقت سابق',
    restoreDesc: 'الصق رمز الوصول المباشر (Bearer Token) أو البريد وكلمة المرور أدناه لإعادة تحميل صندوق الوارد.',
    tokenTab: 'بواسطة رمز الوصول',
    credentialsTab: 'بالبريد وكلمة المرور',
    tokenPlaceholder: 'الصق رمز الوصول Bearer Token هنا...',
    emailPlaceholder: 'email@domain.com',
    passwordPlaceholder: 'كلمة مرور الحساب',
    restoreSubmit: 'استعادة البريد',

    // FAQ Section
    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'كل ما تحتاج لمعرفته عن خدمة الشريحي للبريد المؤقت',
    faq1Q: 'ما هو البريد الإلكتروني المؤقت؟',
    faq1A: 'البريد الإلكتروني المؤقت هو عنوان بريد جاهز للاستخدام لفترة محددة، يُستخدم لاستقبال رسائل التفعيل والروابط دون الحاجة للكشف عن بريدك الشخصي.',
    faq2Q: 'كم تدوم صلاحية البريد المؤقت؟',
    faq2A: 'يمكنك اختيار مدة الصلاحية من 10 دقائق وحتى 5 أيام. كما يمكنك حفظ بيانات البريد أو الرمز لاستعادته في أي وقت.',
    faq3Q: 'هل خدمة الشريحي مجانية؟',
    faq3A: 'نعم! خدمة الشريحي مجانية 100% وبدون أي تسجيل. يتم إنشاء بريد تلقائياً بمجرد دخولك للموقع.',
    faq4Q: 'هل يمكنني إرسال رسائل من هذا البريد المؤقت؟',
    faq4A: 'لا. خدمات البريد المؤقت مصممة خصيصاً لاستقبال الرسائل فقط لحماية الخصوصية ومنع استخدامها في إرسال السبام.',
    faq5Q: 'هل خصوصيتي محفوظة؟',
    faq5A: 'نعم. لكن يرجى العلم أن البريد المؤقت مؤقت وعام، لذا يُنصح بعدم استخدامه للحسابات البنكية أو الحساسة جداً.',

    // Footer
    footerDesc: 'يوفر الشريحي عناوين بريد مؤقتة سريعة وآمنة ومدعومة ببرمجية mail.tm API.',
    disclaimerTitle: 'تنويه الخصوصية',
    disclaimerText: 'البريد المؤقت مؤقت وعام. لا تستخدمه للحسابات البنكية أو الحساسة أو الحسابات الرئيسية. تخضع جميع البيانات لدورة حياة مؤقتة.',
    copyright: '© 2026 الشريحي. جميع الحقوق محفوظة.',

    // Notifications & Errors
    copiedToast: 'تم نسخ عنوان البريد إلى الحافظة!',
    copiedCredentialsToast: 'تم نسخ ملخص البيانات إلى الحافظة!',
    newEmailGenerated: 'تم إنشاء بريد مؤقت جديد بنجاح!',
    inboxRefreshed: 'تم تحديث صندوق الوارد بنجاح!',
    newMessageReceived: 'وصلت رسالة جديدة!',
    errorTitle: 'حدث خطأ',
    rateLimitError: 'تم تجاوز حد الطلبات. جاري الانتظار 10 ثوانٍ وإعادة المحاولة...',
    networkError: 'مشكلة في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.',
    domainError: 'تعذر جلب النطاقات المتاحة. جاري إعادة المحاولة...',
    createAccountError: 'فشل إنشاء الحساب المؤقت. يرجى المحاولة مرة أخرى.',
    restoreSuccess: 'تمت استعادة جلسة البريد بنجاح!',
    restoreFailed: 'فشلت استعادة الجلسة. يرجى التحقق من صحة الرمز أو البيانات.',
    deleteMsgSuccess: 'تم حذف الرسالة بنجاح',
  },
};
