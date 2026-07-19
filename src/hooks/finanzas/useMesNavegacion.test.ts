import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMesNavegacion } from './useMesNavegacion';
import type { FinanzasData } from '../../types/finanzas';

const datosVacios: FinanzasData = { categorias: [], gastosFijos: [], meses: {} };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15)); // 15 de julio 2026
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useMesNavegacion mientras cargando es true (sincronización remota en curso)', () => {
  it('no crea el mes actual mientras cargando es true, aunque falte en data', () => {
    const persistir = vi.fn();
    renderHook(({ cargando }) => useMesNavegacion(datosVacios, persistir, cargando), {
      initialProps: { cargando: true },
    });

    expect(persistir).not.toHaveBeenCalled();
  });

  it('crea el mes actual en cuanto cargando pasa a false, si sigue faltando en data', () => {
    const persistir = vi.fn();
    const { rerender } = renderHook(({ cargando }) => useMesNavegacion(datosVacios, persistir, cargando), {
      initialProps: { cargando: true },
    });

    expect(persistir).not.toHaveBeenCalled();

    rerender({ cargando: false });

    expect(persistir).toHaveBeenCalled();
  });

  it('no crea el mes si ya llegó de lo remoto antes de que cargando pase a false', () => {
    const persistir = vi.fn();
    const datosConMes: FinanzasData = {
      ...datosVacios,
      meses: {
        '2026-07': { clave: '2026-07', ingresoFijo: 15000, presupuestos: [], ahorro: null, ingresosExtra: [], gastos: [] },
      },
    };

    const { rerender } = renderHook(
      ({ data, cargando }) => useMesNavegacion(data, persistir, cargando),
      { initialProps: { data: datosVacios, cargando: true } }
    );

    rerender({ data: datosConMes, cargando: false });

    expect(persistir).not.toHaveBeenCalled();
  });
});

describe('useMesNavegacion en modo local (cargando siempre false, como useFinanzas() sin userId)', () => {
  it('crea el mes actual normalmente si falta', () => {
    const persistir = vi.fn();
    renderHook(() => useMesNavegacion(datosVacios, persistir, false));

    expect(persistir).toHaveBeenCalled();
  });
});
