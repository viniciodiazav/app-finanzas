import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutIngreso } from './DonutIngreso';

describe('DonutIngreso', () => {
  it('no renderiza nada si no hay ingreso fijo definido', () => {
    const { container } = render(
      <DonutIngreso
        ingresoFijo={0}
        totalGastos={0}
        totalPresupuestado={0}
        montoAhorro={0}
        disponibleParaPresupuestar={0}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('muestra el desglose de gastado, presupuestado y sin presupuestar', () => {
    render(
      <DonutIngreso
        ingresoFijo={10000}
        totalGastos={2000}
        totalPresupuestado={5000}
        montoAhorro={1000}
        disponibleParaPresupuestar={4000}
      />
    );

    expect(screen.getByText(/Gastado \$2,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/Presupuestado \$3,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/Ahorro \$1,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/Sin presupuestar \$4,000.00/)).toBeInTheDocument();
  });

  it('muestra la advertencia de sobregasto cuando el gasto total excede lo presupuestado', () => {
    render(
      <DonutIngreso
        ingresoFijo={10000}
        totalGastos={6000}
        totalPresupuestado={5000}
        montoAhorro={0}
        disponibleParaPresupuestar={5000}
      />
    );

    expect(screen.getByText('Gasto total supera lo presupuestado')).toBeInTheDocument();
  });
});
