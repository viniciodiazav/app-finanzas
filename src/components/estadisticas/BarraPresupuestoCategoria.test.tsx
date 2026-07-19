import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarraPresupuestoCategoria } from './BarraPresupuestoCategoria';
import type { PresupuestoDetalle } from '../../types/finanzas';

function presupuesto(overrides: Partial<PresupuestoDetalle> = {}): PresupuestoDetalle {
  return {
    id: 'p1',
    categoriaId: 'c1',
    modo: 'monto',
    valor: 1000,
    nombreCategoria: 'Comida',
    monto: 1000,
    porcentaje: 10,
    gastado: 500,
    restante: 500,
    sobregasto: false,
    ...overrides,
  };
}

describe('BarraPresupuestoCategoria', () => {
  it('muestra el porcentaje usado cuando no hay sobregasto', () => {
    render(<BarraPresupuestoCategoria presupuesto={presupuesto()} />);

    expect(screen.getByText('$500.00 / $1,000.00')).toBeInTheDocument();
    expect(screen.getByText('50% usado')).toBeInTheDocument();
  });

  it('muestra el mensaje de excedido cuando hay sobregasto', () => {
    render(<BarraPresupuestoCategoria presupuesto={presupuesto({ gastado: 1200, restante: -200, sobregasto: true })} />);

    expect(screen.getByText(/Excedido 20% sobre el presupuesto/)).toBeInTheDocument();
  });
});
