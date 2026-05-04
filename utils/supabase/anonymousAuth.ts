import { createClient } from './client';

export const USE_REAL_AUTH = true; // Feature flag

const supabase = createClient();

/**
 * signs in the user anonymously using Supabase Auth.
 */
export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (!error && data.session) {
    localStorage.setItem('btl_anon_session', JSON.stringify(data.session));
  }
  return { user: data.user, error };
}

/**
 * Returns the current authenticated user (including anonymous users).
 */
export async function getAnonymousUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Links an email identity to an existing anonymous user session.
 * Per Supabase docs, updating the email of an anonymous user converts them to a permanent user.
 */
export async function linkIdentityToAnonymousUser(email: string) {
  const { data, error } = await supabase.auth.updateUser({ email });
  return { data, error };
}
