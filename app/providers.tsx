'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect, createContext, useContext } from 'react';
import { AppProvider } from './context/AppContext';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<{ session: Session | null; supabase: any }>({ session: null, supabase: null });

export const useAuth = () => useContext(AuthContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, supabase }}>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthContext.Provider>
  );
}
