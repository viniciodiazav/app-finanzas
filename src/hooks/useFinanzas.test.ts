import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFinanzas } from './useFinanzas';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15)); // 15 de julio 2026
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ingreso fijo mensual', () => {
  it('se puede definir una vez y queda reflejado en mesActual', () => {
    const { result } = renderHook(() => useFinanzas());

    act(() => {
      const r = result.current.definirIngresoFijo(15000);
      expect(r.ok).toBe(true);
    });

    expect(result.current.mesActual.ingresoFijo).toBe(15000);
  });

  it('es inmutable: un segundo intento de definirlo se rechaza y no cambia el valor', () => {
    const { result } = renderHook(() => useFinanzas());

    act(() => {
      result.current.definirIngresoFijo(15000);
    });

    act(() => {
      const r = result.current.definirIngresoFijo(99999);
      expect(r.ok).toBe(false);
    });

    expect(result.current.mesActual.ingresoFijo).toBe(15000);
  });

  it('no se arrastra de un mes a otro', () => {
    const { result } = renderHook(() => useFinanzas());

    act(() => {
      result.current.definirIngresoFijo(15000);
    });
    act(() => {
      result.current.mesSiguiente();
    });

    expect(result.current.mesActual.ingresoFijo).toBe(0);
  });
});

describe('presupuestos por categoría', () => {
  it('no permite dos presupuestos para la misma categoría en el mismo mes', () => {
    const { result } = renderHook(() => useFinanzas());
    let categoriaId = '';

    act(() => {
      result.current.definirIngresoFijo(20000);
    });
    act(() => {
      const r = result.current.agregarCategoria('Comida');
      categoriaId = r.id!;
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(categoriaId, 'monto', 3000);
      expect(r.ok).toBe(true);
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(categoriaId, 'monto', 1000);
      expect(r.ok).toBe(false);
    });

    expect(result.current.presupuestosDetalle).toHaveLength(1);
  });

  it('rechaza un presupuesto que exceda el ingreso fijo disponible', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';
    let transporte = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      transporte = result.current.agregarCategoria('Transporte').id!;
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(comida, 'monto', 8000);
      expect(r.ok).toBe(true);
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(transporte, 'monto', 3000);
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/no puede superar el ingreso fijo/);
    });

    expect(result.current.totalPresupuestado).toBe(8000);
  });
});

describe('ahorro mensual comparte el límite con los presupuestos', () => {
  it('rechaza el ahorro si presupuestos + ahorro superan el ingreso fijo', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      result.current.agregarPresupuestoCategoria(comida, 'monto', 7000);
    });
    act(() => {
      const r = result.current.definirAhorro('monto', 4000);
      expect(r.ok).toBe(false);
    });

    expect(result.current.ahorroDetalle).toBeNull();
  });

  it('acepta el ahorro cuando cabe dentro del disponible y se refleja en montoAhorro', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      result.current.agregarPresupuestoCategoria(comida, 'monto', 6000);
    });
    act(() => {
      const r = result.current.definirAhorro('porcentaje', 20); // 20% de 10000 = 2000
      expect(r.ok).toBe(true);
    });

    expect(result.current.montoAhorro).toBe(2000);
    expect(result.current.disponibleParaPresupuestar).toBe(2000); // 10000 - 6000 - 2000
  });

  it('rechaza un nuevo presupuesto que ya no cabe por culpa del ahorro ya definido', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';
    let transporte = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      transporte = result.current.agregarCategoria('Transporte').id!;
    });
    act(() => {
      result.current.definirAhorro('monto', 7000);
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(comida, 'monto', 2000);
      expect(r.ok).toBe(true);
    });
    act(() => {
      const r = result.current.agregarPresupuestoCategoria(transporte, 'monto', 2000);
      expect(r.ok).toBe(false);
    });
  });
});

describe('gastos fijos: generación y expiración', () => {
  it('se genera en el mes de inicio, se repite mientras dure, y desaparece al vencer', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      result.current.agregarPresupuestoCategoria(comida, 'monto', 5000);
    });
    act(() => {
      // Netflix, dura 2 meses (julio y agosto)
      result.current.agregarGastoFijo(300, 'Netflix', comida, 2);
    });

    expect(result.current.mesActual.gastos.some((g) => g.descripcion === 'Netflix')).toBe(true);
    expect(result.current.data.gastosFijos).toHaveLength(1);

    act(() => {
      result.current.mesSiguiente(); // agosto: debe seguir activo
    });
    expect(result.current.mesActual.gastos.some((g) => g.descripcion === 'Netflix')).toBe(true);

    act(() => {
      result.current.mesSiguiente(); // septiembre: ya venció
    });
    expect(result.current.mesActual.gastos.some((g) => g.descripcion === 'Netflix')).toBe(false);
    expect(result.current.data.gastosFijos).toHaveLength(0);
  });

  it('el historial de un mes ya visitado no se borra cuando el gasto fijo vence después', () => {
    const { result } = renderHook(() => useFinanzas());
    let comida = '';

    act(() => {
      result.current.definirIngresoFijo(10000);
    });
    act(() => {
      comida = result.current.agregarCategoria('Comida').id!;
    });
    act(() => {
      result.current.agregarPresupuestoCategoria(comida, 'monto', 5000);
    });
    act(() => {
      result.current.agregarGastoFijo(300, 'Netflix', comida, 1); // solo julio
    });
    act(() => {
      result.current.mesSiguiente(); // agosto: ya venció y se poda de gastosFijos
    });

    expect(result.current.data.meses['2026-07'].gastos.some((g) => g.descripcion === 'Netflix')).toBe(true);
  });
});
