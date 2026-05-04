/**
 * anonymousSession.ts
 * Manages unique tokens for anonymous chat sessions.
 */

export const USE_REAL_CHAT = false; // Feature flag - set to true for production testing
export const USE_LISTENER_SYSTEM = false; // Feature flag

export function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') return '';
  
  let token = localStorage.getItem('btl_session_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('btl_session_token', token);
  }
  return token;
}
