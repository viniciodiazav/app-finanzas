import { useState } from 'react';

interface LoginScreenProps {
  onIniciarSesion: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  onCrearCuenta: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
}

export function LoginScreen({ onIniciarSesion, onCrearCuenta }: LoginScreenProps) {
  const [modo, setModo] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cuentaCreada, setCuentaCreada] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setEnviando(true);
    const resultado =
      modo === 'login' ? await onIniciarSesion(email.trim(), password) : await onCrearCuenta(email.trim(), password);
    setEnviando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? 'Ocurrió un error inesperado.');
      return;
    }
    if (modo === 'signup') {
      setCuentaCreada(true);
    }
  };

  const cambiarModo = () => {
    setModo((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setCuentaCreada(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h1 className="text-lg font-bold text-slate-800 mb-1">Mis Finanzas</h1>
        <p className="text-sm text-slate-500 mb-4">
          {modo === 'login' ? 'Inicia sesión para ver tus datos.' : 'Crea una cuenta para empezar.'}
        </p>

        {cuentaCreada ? (
          <p className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2">
            Cuenta creada. Ya puedes iniciar sesión.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-60"
            >
              {enviando ? 'Espera...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <button onClick={cambiarModo} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-4">
          {modo === 'login' ? '¿No tienes cuenta? Créala aquí' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
