import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from './LoginScreen';

interface AuthGateProps {
  children: (userId: string, signOut: () => Promise<void>) => ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, cargando, signIn, signUp, signOut } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onIniciarSesion={signIn} onCrearCuenta={signUp} />;
  }

  return <>{children(user.id, signOut)}</>;
}
