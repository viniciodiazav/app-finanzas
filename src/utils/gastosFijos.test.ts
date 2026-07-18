import { describe, expect, it } from 'vitest';
import type { GastoFijo } from '../types/finanzas';
import { claveFinGastoFijo, esGastoFijoActivoEnMes, estaVencido } from './gastosFijos';

function crearGastoFijo(overrides: Partial<GastoFijo> = {}): GastoFijo {
  return {
    id: '1',
    monto: 100,
    descripcion: 'Netflix',
    categoriaId: 'cat-1',
    mesInicio: '2026-07',
    duracionMeses: null,
    ...overrides,
  };
}

describe('claveFinGastoFijo', () => {
  it('devuelve null para gastos indefinidos', () => {
    expect(claveFinGastoFijo(crearGastoFijo({ duracionMeses: null }))).toBeNull();
  });

  it('calcula el mes de fin sumando la duración al mes de inicio', () => {
    expect(claveFinGastoFijo(crearGastoFijo({ mesInicio: '2026-07', duracionMeses: 2 }))).toBe('2026-09');
  });
});

describe('esGastoFijoActivoEnMes', () => {
  it('no está activo antes del mes de inicio', () => {
    const gf = crearGastoFijo({ mesInicio: '2026-07' });
    expect(esGastoFijoActivoEnMes(gf, '2026-06')).toBe(false);
  });

  it('un gasto indefinido está activo en el mes de inicio y en cualquier mes posterior', () => {
    const gf = crearGastoFijo({ mesInicio: '2026-07', duracionMeses: null });
    expect(esGastoFijoActivoEnMes(gf, '2026-07')).toBe(true);
    expect(esGastoFijoActivoEnMes(gf, '2030-01')).toBe(true);
  });

  it('un gasto con duración está activo solo dentro del rango [inicio, inicio+duracion)', () => {
    const gf = crearGastoFijo({ mesInicio: '2026-07', duracionMeses: 2 });
    expect(esGastoFijoActivoEnMes(gf, '2026-07')).toBe(true);
    expect(esGastoFijoActivoEnMes(gf, '2026-08')).toBe(true);
    expect(esGastoFijoActivoEnMes(gf, '2026-09')).toBe(false);
  });
});

describe('estaVencido', () => {
  it('un gasto indefinido nunca vence', () => {
    const gf = crearGastoFijo({ duracionMeses: null });
    expect(estaVencido(gf, '2099-12')).toBe(false);
  });

  it('un gasto con duración vence justo al llegar al mes de fin', () => {
    const gf = crearGastoFijo({ mesInicio: '2026-07', duracionMeses: 2 });
    expect(estaVencido(gf, '2026-08')).toBe(false);
    expect(estaVencido(gf, '2026-09')).toBe(true);
    expect(estaVencido(gf, '2026-10')).toBe(true);
  });
});
