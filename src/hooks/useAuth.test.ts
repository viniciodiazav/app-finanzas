import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';

const { getSession, onAuthStateChange, signInWithPassword, signUp, signOut, unsubscribe } = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange, signInWithPassword, signUp, signOut },
  },
}));

beforeEach(() => {
  getSession.mockReset().mockResolvedValue({ data: { session: null } });
  onAuthStateChange.mockReset().mockReturnValue({ data: { subscription: { unsubscribe } } });
  signInWithPassword.mockReset();
  signUp.mockReset();
  signOut.mockReset().mockResolvedValue({ error: null });
  unsubscribe.mockReset();
});

describe('useAuth', () => {
  it('empieza cargando y termina sin usuario si no hay sesión', async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.cargando).toBe(true);
    await waitFor(() => expect(result.current.cargando).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('toma el usuario de la sesión existente al montar', async () => {
    const usuario = { id: 'user-1', email: 'a@b.com' };
    getSession.mockResolvedValue({ data: { session: { user: usuario } } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.cargando).toBe(false));
    expect(result.current.user).toEqual(usuario);
  });

  it('actualiza el usuario cuando cambia el estado de auth', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    const callback = onAuthStateChange.mock.calls[0][0];
    const usuario = { id: 'user-2', email: 'c@d.com' };

    act(() => {
      callback('SIGNED_IN', { user: usuario });
    });

    expect(result.current.user).toEqual(usuario);
  });

  it('signIn convierte el usuario a un correo sintético y devuelve ok cuando no hay error', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    const respuesta = await result.current.signIn('Ana', 'clave123');

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'ana@misfinanzas.local', password: 'clave123' });
    expect(respuesta).toEqual({ ok: true });
  });

  it('signIn devuelve el mensaje de error de Supabase cuando falla', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Credenciales inválidas' } });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    const respuesta = await result.current.signIn('ana', 'mala');

    expect(respuesta).toEqual({ ok: false, error: 'Credenciales inválidas' });
  });

  it('signUp convierte el usuario a un correo sintético y llama a supabase.auth.signUp', async () => {
    signUp.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    const respuesta = await result.current.signUp('nuevo', 'clave123');

    expect(signUp).toHaveBeenCalledWith({ email: 'nuevo@misfinanzas.local', password: 'clave123' });
    expect(respuesta).toEqual({ ok: true });
  });

  it('signOut llama a supabase.auth.signOut', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    await result.current.signOut();

    expect(signOut).toHaveBeenCalled();
  });

  it('se desuscribe del listener de auth al desmontar', async () => {
    const { result, unmount } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.cargando).toBe(false));

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
