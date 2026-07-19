import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InsightsList } from './InsightsList';
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

describe('InsightsList', () => {
  it('destaca la categoría con más gasto', () => {
    render(
      <InsightsList
        totalGastos={500}
        presupuestos={[presupuesto()]}
        gastoMesAnterior={null}
        presupuestoSinUsar={500}
      />
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText(/con \$500.00 \(100% de tu gasto total\)/)).toBeInTheDocument();
  });

  it('avisa cuando ningún presupuesto se excedió', () => {
    render(
      <InsightsList totalGastos={0} presupuestos={[presupuesto({ gastado: 0 })]} gastoMesAnterior={null} presupuestoSinUsar={0} />
    );

    expect(screen.getByText('Ningún presupuesto por categoría se excedió este mes.')).toBeInTheDocument();
  });

  it('lista las categorías excedidas cuando existen', () => {
    render(
      <InsightsList
        totalGastos={1500}
        presupuestos={[presupuesto({ gastado: 1500, restante: -500, sobregasto: true })]}
        gastoMesAnterior={null}
        presupuestoSinUsar={0}
      />
    );

    expect(screen.getAllByText('Comida').length).toBeGreaterThan(0);
    expect(screen.getByText(/Excediste el presupuesto en/)).toBeInTheDocument();
  });

  it('compara contra el mes anterior cuando el dato existe', () => {
    render(
      <InsightsList
        totalGastos={800}
        presupuestos={[presupuesto({ gastado: 800 })]}
        gastoMesAnterior={1000}
        presupuestoSinUsar={0}
      />
    );

    expect(screen.getByText(/Gastaste \$200.00 menos que el mes pasado/)).toBeInTheDocument();
  });

  it('menciona el presupuesto sin usar cuando es mayor a 0', () => {
    render(
      <InsightsList totalGastos={0} presupuestos={[presupuesto({ gastado: 0 })]} gastoMesAnterior={null} presupuestoSinUsar={500} />
    );

    expect(screen.getByText(/Tienes \$500.00 presupuestados que aún no has gastado\./)).toBeInTheDocument();
  });
});
