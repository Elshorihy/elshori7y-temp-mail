import { Account, Domain, Message, MessageDetail, TokenResponse } from '../types';

const API_BASE_URL = 'https://api.mail.tm';

export class MailApiError extends Error {
  status?: number;
  code?: string;
  
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'MailApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Helper to handle fetch responses and handle JSON parsing and errors.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 429) {
      throw new MailApiError('Rate limit exceeded. Please wait a moment before trying again.', 429, 'RATE_LIMIT');
    }

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // use default error message
      }
      throw new MailApiError(errorMessage, response.status);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof MailApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new MailApiError('Network error. Please check your internet connection.', 0, 'NETWORK_ERROR');
    }
    throw new MailApiError(error instanceof Error ? error.message : 'An unknown error occurred.');
  }
}

/**
 * 1. Get available domains
 */
export async function getDomains(): Promise<Domain[]> {
  const data = await apiFetch<Domain[] | { 'hydra:member': Domain[] }>('/domains');
  if (Array.isArray(data)) {
    return data.filter(d => d.isActive);
  }
  if ('hydra:member' in data && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'].filter(d => d.isActive);
  }
  return [];
}

/**
 * 2. Create a new mail.tm account
 */
export async function createAccount(address: string, password: string): Promise<Account> {
  return await apiFetch<Account>('/accounts', {
    method: 'POST',
    body: JSON.stringify({ address, password }),
  });
}

/**
 * 3. Authenticate and retrieve bearer token
 */
export async function getToken(address: string, password: string): Promise<TokenResponse> {
  return await apiFetch<TokenResponse>('/token', {
    method: 'POST',
    body: JSON.stringify({ address, password }),
  });
}

/**
 * 4. Fetch message list
 */
export async function getMessages(token: string, page: number = 1): Promise<Message[]> {
  const data = await apiFetch<Message[] | { 'hydra:member': Message[] }>(`/messages?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (Array.isArray(data)) {
    return data;
  }
  if ('hydra:member' in data && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'];
  }
  return [];
}

/**
 * 5. Fetch full message detail by ID
 */
export async function getMessage(token: string, id: string): Promise<MessageDetail> {
  return await apiFetch<MessageDetail>(`/messages/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Delete a single message
 */
export async function deleteMessage(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/messages/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Delete an account
 */
export async function deleteAccount(token: string, accountId: string): Promise<void> {
  await apiFetch<void>(`/accounts/${accountId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Utility: Generate random alphanumeric username prefix
 */
export function generateRandomUsername(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'user_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Utility: Generate strong password for mail.tm account creation
 */
export function generateSecurePassword(length: number = 14): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
