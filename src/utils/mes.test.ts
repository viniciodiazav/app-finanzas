import { describe, expect, it } from 'vitest';
import { claveMesDeFecha, estadoTemporalMes, etiquetaMes, esMesFuturo, partesClave, sumarMeses } from './mes';

describe('claveMesDeFecha', () => {
  it('formatea año y mes con ceros a la izquierda', () => {
    expect(claveMesDeFecha(new Date(2026, 0, 15))).toBe('2026-01');
    expect(claveMesDeFecha(new Date(2026, 10, 1))).toBe('2026-11');
  });
});

describe('partesClave', () => {
  it('separa año y mes de la clave', () => {
    expect(partesClave('2026-07')).toEqual({ year: 2026, month: 7 });
  });
});

describe('sumarMeses', () => {
  it('suma meses dentro del mismo año', () => {
    expect(sumarMeses('2026-07', 1)).toBe('2026-08');
    expect(sumarMeses('2026-07', -1)).toBe('2026-06');
  });

  it('cruza el límite de año hacia adelante', () => {
    expect(sumarMeses('2026-12', 1)).toBe('2027-01');
  });

  it('cruza el límite de año hacia atrás', () => {
    expect(sumarMeses('2026-01', -1)).toBe('2025-12');
  });

  it('soporta saltos de varios meses', () => {
    expect(sumarMeses('2026-01', 13)).toBe('2027-02');
  });
});

describe('etiquetaMes', () => {
  it('devuelve el nombre del mes en español con el año', () => {
    expect(etiquetaMes('2026-07')).toBe('Julio 2026');
    expect(etiquetaMes('2026-01')).toBe('Enero 2026');
  });
});

describe('esMesFuturo', () => {
  it('compara contra el mes actual real', () => {
    const actual = claveMesDeFecha(new Date());
    expect(esMesFuturo(sumarMeses(actual, 1))).toBe(true);
    expect(esMesFuturo(actual)).toBe(false);
    expect(esMesFuturo(sumarMeses(actual, -1))).toBe(false);
  });
});

describe('estadoTemporalMes', () => {
  it('clasifica correctamente pasado, actual y futuro', () => {
    const actual = claveMesDeFecha(new Date());
    expect(estadoTemporalMes(sumarMeses(actual, -1))).toBe('pasado');
    expect(estadoTemporalMes(actual)).toBe('actual');
    expect(estadoTemporalMes(sumarMeses(actual, 1))).toBe('futuro');
  });
});
