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
  it('usa los datos remotos como fuente de verdad cuando ya existe una fila, y los cachea en una llave propia del usuario', async () => {
    const datosRemotos = { categorias: [{ id: 'c1', nombre: 'Comida' }], gastosFijos: [], meses: {} };
    maybeSingle.mockResolvedValue({ data: { data: datosRemotos }, error: null });

    const { result } = renderHook(() => usePersistencia('user-1'));

    expect(result.current.cargando).toBe(true);

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.data).toEqual(datosRemotos);
    expect(JSON.parse(localStorage.getItem('finanzas-app-data:user-1')!)).toEqual(datosRemotos);
  });

  it('siembra Supabase con los datos previos sin cuenta cuando el usuario no tiene fila remota todavía, y los consume', async () => {
    const datosPrevios = { categorias: [{ id: 'c1', nombre: 'Ocio' }], gastosFijos: [], meses: {} };
    localStorage.setItem('finanzas-app-data', JSON.stringify(datosPrevios));
    maybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => usePersistencia('user-1'));

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(upsert).toHaveBeenCalledWith({ user_id: 'user-1', data: datosPrevios });
    expect(result.current.data).toEqual(datosPrevios);
    expect(JSON.parse(localStorage.getItem('finanzas-app-data:user-1')!)).toEqual(datosPrevios);
    // La llave sin dueño se consume para que no se filtre a otra cuenta después.
    expect(localStorage.getItem('finanzas-app-data')).toBeNull();
  });

  it('no filtra los datos de una cuenta a otra cuenta distinta en el mismo navegador', async () => {
    const datosCuentaA = { categorias: [{ id: 'c1', nombre: 'Cuenta A' }], gastosFijos: [], meses: {} };
    localStorage.setItem('finanzas-app-data', JSON.stringify(datosCuentaA));
    maybeSingle.mockResolvedValue({ data: null, error: null });

    const primeraSesion = renderHook(() => usePersistencia('user-a'));
    await waitFor(() => expect(primeraSesion.result.current.cargando).toBe(false));
    expect(primeraSesion.result.current.data).toEqual(datosCuentaA);
    primeraSesion.unmount();

    // Cuenta distinta, sin fila remota tampoco: no debe heredar los datos de la cuenta A,
    // porque la llave sin dueño ya se consumió y la de user-b nunca existió.
    upsert.mockClear();
    maybeSingle.mockResolvedValue({ data: null, error: null });
    const segundaSesion = renderHook(() => usePersistencia('user-b'));
    await waitFor(() => expect(segundaSesion.result.current.cargando).toBe(false));

    expect(segundaSesion.result.current.data).toEqual({ categorias: [], gastosFijos: [], meses: {} });
    expect(upsert).toHaveBeenCalledWith({ user_id: 'user-b', data: { categorias: [], gastosFijos: [], meses: {} } });
  });

  it('cada persistir hace upsert a Supabase y guarda en la llave propia del usuario', async () => {
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
    expect(JSON.parse(localStorage.getItem('finanzas-app-data:user-1')!).categorias).toEqual([
      { id: 'nueva', nombre: 'Nueva' },
    ]);
  });
});
