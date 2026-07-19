import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthGate } from './AuthGate';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const useAuthMock = vi.mocked(useAuth);

describe('AuthGate', () => {
  it('muestra un estado de carga mientras se resuelve la sesión', () => {
    useAuthMock.mockReturnValue({
      user: null,
      cargando: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AuthGate>{() => <p>Contenido protegido</p>}</AuthGate>);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra LoginScreen cuando no hay usuario', () => {
    useAuthMock.mockReturnValue({
      user: null,
      cargando: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AuthGate>{() => <p>Contenido protegido</p>}</AuthGate>);

    expect(screen.getByText('Mis Finanzas')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('renderiza los children con el userId y signOut cuando hay sesión', () => {
    const signOut = vi.fn();
    useAuthMock.mockReturnValue({
      // @ts-expect-error - solo se usan los campos relevantes para este test
      user: { id: 'user-1' },
      cargando: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut,
    });

    render(
      <AuthGate>
        {(userId, cerrarSesion) => (
          <p>
            Sesión de {userId} - {cerrarSesion === signOut ? 'signOut correcto' : 'signOut incorrecto'}
          </p>
        )}
      </AuthGate>
    );

    expect(screen.getByText('Sesión de user-1 - signOut correcto')).toBeInTheDocument();
  });
});
