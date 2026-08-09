import DOMPurify from 'dompurify';

/**
 * Clean and sanitize HTML string to prevent XSS attacks while preserving email layouts, tables, and colors.
 */
export function sanitizeHtmlContent(htmlContent: string): string {
  if (!htmlContent) return '';

  return DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'body', 'br', 'caption', 'center', 'code', 'div', 'em', 'font',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's',
      'span', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead',
      'tr', 'u', 'ul', 'style', 'section', 'article', 'main', 'header', 'footer'
    ],
    ALLOWED_ATTR: [
      'align', 'alt', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'class', 'color',
      'dir', 'face', 'height', 'href', 'id', 'src', 'style', 'target', 'title', 'width', 'rel'
    ],
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

/**
 * Format relative time in EN/AR
 */
export function formatRelativeTime(dateString: string, lang: 'en' | 'ar'): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffSeconds) || diffSeconds < 0) {
      return lang === 'ar' ? 'الآن' : 'Just now';
    }

    if (diffSeconds < 60) {
      return lang === 'ar' ? 'منذ بضع ثوانٍ' : `${diffSeconds}s ago`;
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return lang === 'ar' ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return lang === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return lang === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }

    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
