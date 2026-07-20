import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

// Supabase Auth solo maneja identidades por correo. Como esta app usa
// usuario+contraseña (sin correos reales ni verificación), cada nombre de
// usuario se mapea a un correo sintético bajo este dominio ficticio, que
// también nos da gratis la validación de "usuario ya existe".
const DOMINIO_USUARIO_SINTETICO = 'misfinanzas.local';

function usernameAEmail(username: string): string {
  return `${username.toLowerCase()}@${DOMINIO_USUARIO_SINTETICO}`;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email: usernameAEmail(username), password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signUp = useCallback(async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({ email: usernameAEmail(username), password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, cargando, signIn, signUp, signOut };
}
