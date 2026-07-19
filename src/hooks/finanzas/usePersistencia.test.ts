import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePersistencia } from './usePersistencia';

const { maybeSingle, upsert, from } = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const upsert = vi.fn();
  const from = vi.fn(() => ({
    select: () => ({ eq: () => ({ maybeSingle }) }),
    upsert,
  }));
  return { maybeSingle, upsert, from };
});

vi.mock('../../lib/supabaseClient', () => ({
  supabase: { from },
}));

beforeEach(() => {
  localStorage.clear();
  from.mockClear();
  maybeSingle.mockReset();
  upsert.mockReset().mockResolvedValue({ error: null });
});

describe('usePersistencia sin userId (modo local, como en los tests existentes)', () => {
  it('no llama a Supabase en ningún momento y arranca con cargando en false', () => {
    const { result } = renderHook(() => usePersistencia(null));

    expect(result.current.cargando).toBe(false);
    expect(from).not.toHaveBeenCalled();
  });
});

describe('usePersistencia con userId (modo remoto)', () => {
  it('usa los datos remotos como fuente de verdad cuando ya existe una fila', async () => {
    const datosRemotos = { categorias: [{ id: 'c1', nombre: 'Comida' }], gastosFijos: [], meses: {} };
    maybeSingle.mockResolvedValue({ data: { data: datosRemotos }, error: null });

    const { result } = renderHook(() => usePersistencia('user-1'));

    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.data).toEqual(datosRemotos);
    expect(JSON.parse(localStorage.getItem('finanzas-app-data')!)).toEqual(datosRemotos);
  });

  it('siembra Supabase con los datos locales cuando el usuario no tiene fila remota todavía', async () => {
    const datosLocales = { categorias: [{ id: 'c1', nombre: 'Ocio' }], gastosFijos: [], meses: {} };
    localStorage.setItem('finanzas-app-data', JSON.stringify(datosLocales));
    maybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => usePersistencia('user-1'));

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(upsert).toHaveBeenCalledWith({ user_id: 'user-1', data: datosLocales });
    expect(result.current.data).toEqual(datosLocales);
  });

  it('cada persistir hace upsert a Supabase con los datos nuevos', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    const { result } = renderHook(() => usePersistencia('user-1'));

    await waitFor(() => expect(result.current.cargando).toBe(false));
    upsert.mockClear();

    act(() => {
      result.current.persistir((prev) => ({
        ...prev,
        categorias: [...prev.categorias, { id: 'nueva', nombre: 'Nueva' }],
      }));
    });

    await waitFor(() => expect(upsert).toHaveBeenCalled());
    const llamada = upsert.mock.calls[0][0];
    expect(llamada.user_id).toBe('user-1');
    expect(llamada.data.categorias).toEqual([{ id: 'nueva', nombre: 'Nueva' }]);
  });
});
