import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DistribucionGastoPorCategoria } from './DistribucionGastoPorCategoria';
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
    gastado: 300,
    restante: 700,
    sobregasto: false,
    ...overrides,
  };
}

describe('DistribucionGastoPorCategoria', () => {
  it('muestra el mensaje vacío cuando no hay gastos', () => {
    render(<DistribucionGastoPorCategoria presupuestos={[presupuesto({ gastado: 0 })]} totalGastos={0} />);

    expect(screen.getByText('Aún no hay gastos registrados este mes.')).toBeInTheDocument();
  });

  it('muestra las categorías con gasto y su porcentaje del total', () => {
    render(
      <DistribucionGastoPorCategoria
        presupuestos={[presupuesto({ gastado: 300 }), presupuesto({ id: 'p2', nombreCategoria: 'Sin gasto', gastado: 0 })]}
        totalGastos={300}
      />
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('$300.00 (100%)')).toBeInTheDocument();
    expect(screen.queryByText('Sin gasto')).not.toBeInTheDocument();
  });
});
