import { describe, expect, it } from 'vitest';
import { montoDePresupuesto, porcentajeDePresupuesto } from './presupuesto';

describe('montoDePresupuesto', () => {
  it('modo monto devuelve el valor tal cual', () => {
    expect(montoDePresupuesto({ modo: 'monto', valor: 5000 }, 20000)).toBe(5000);
  });

  it('modo porcentaje calcula sobre el ingreso fijo', () => {
    expect(montoDePresupuesto({ modo: 'porcentaje', valor: 25 }, 20000)).toBe(5000);
  });
});

describe('porcentajeDePresupuesto', () => {
  it('modo porcentaje devuelve el valor tal cual', () => {
    expect(porcentajeDePresupuesto({ modo: 'porcentaje', valor: 30 }, 20000)).toBe(30);
  });

  it('modo monto calcula el porcentaje sobre el ingreso fijo', () => {
    expect(porcentajeDePresupuesto({ modo: 'monto', valor: 6000 }, 20000)).toBe(30);
  });

  it('devuelve 0 si el ingreso fijo es 0 para evitar dividir entre cero', () => {
    expect(porcentajeDePresupuesto({ modo: 'monto', valor: 100 }, 0)).toBe(0);
  });
});
