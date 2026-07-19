import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PresupuestosLista } from './PresupuestosLista';
import type { PresupuestoDetalle } from '../types/finanzas';

function presupuesto(overrides: Partial<PresupuestoDetalle> = {}): PresupuestoDetalle {
  return {
    id: 'p1',
    categoriaId: 'c1',
    modo: 'monto',
    valor: 3000,
    nombreCategoria: 'Comida',
    monto: 3000,
    porcentaje: 15,
    gastado: 500,
    restante: 2500,
    sobregasto: false,
    ...overrides,
  };
}

describe('PresupuestosLista', () => {
  it('muestra el mensaje vacío cuando no hay presupuestos', () => {
    render(
      <PresupuestosLista
        presupuestos={[]}
        totalPresupuestado={0}
        ingresoFijo={0}
        onAgregarPresupuesto={vi.fn()}
        onVerDetalle={vi.fn()}
      />
    );

    expect(screen.getByText('Aún no has definido presupuestos por categoría.')).toBeInTheDocument();
  });

  it('lista los presupuestos y navega al detalle al hacer click', () => {
    const onVerDetalle = vi.fn();
    render(
      <PresupuestosLista
        presupuestos={[presupuesto()]}
        totalPresupuestado={3000}
        ingresoFijo={20000}
        onAgregarPresupuesto={vi.fn()}
        onVerDetalle={onVerDetalle}
      />
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Comida'));
    expect(onVerDetalle).toHaveBeenCalledWith('p1');
  });

  it('resalta en rojo los presupuestos con sobregasto', () => {
    render(
      <PresupuestosLista
        presupuestos={[presupuesto({ sobregasto: true, restante: -100 })]}
        totalPresupuestado={3000}
        ingresoFijo={20000}
        onAgregarPresupuesto={vi.fn()}
        onVerDetalle={vi.fn()}
      />
    );

    expect(screen.getByText('Comida').closest('button')?.className).toMatch(/bg-red-50/);
  });

  it('llama a onAgregarPresupuesto al hacer click en el botón de agregar', () => {
    const onAgregarPresupuesto = vi.fn();
    render(
      <PresupuestosLista
        presupuestos={[]}
        totalPresupuestado={0}
        ingresoFijo={0}
        onAgregarPresupuesto={onAgregarPresupuesto}
        onVerDetalle={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('+ Nuevo presupuesto'));
    expect(onAgregarPresupuesto).toHaveBeenCalled();
  });
});
