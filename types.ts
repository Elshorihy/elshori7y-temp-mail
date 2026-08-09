export type Language = 'en' | 'ar';

export interface Domain {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  address: string;
  quota?: number;
  used?: number;
  isDisabled?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  token: string;
  id: string;
}

export interface EmailAddress {
  name: string;
  address: string;
}

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
  downloadUrl: string;
}

export interface Message {
  id: string;
  accountId: string;
  msgid: string;
  from: EmailAddress;
  to: EmailAddress[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDetail extends Message {
  text?: string;
  html?: string[];
  attachments?: Attachment[];
  headers?: Record<string, string>;
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  flagged?: boolean;
  retentions?: string[];
  retentionDate?: string;
}

export interface DurationOption {
  minutes: number;
  labelEn: string;
  labelAr: string;
}

export interface InboxSession {
  id: string;
  address: string;
  password: string;
  token: string;
  accountId: string;
  createdAt: number; // timestamp ms
  durationMinutes: number; // chosen duration
  expiredAt: number; // timestamp ms
  selectedDomain: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}
