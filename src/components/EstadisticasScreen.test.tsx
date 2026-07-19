import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EstadisticasScreen } from './EstadisticasScreen';
import type { PresupuestoDetalle } from '../types/finanzas';

const presupuestos: PresupuestoDetalle[] = [
  {
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
  },
];

describe('EstadisticasScreen', () => {
  it('muestra los totales principales', () => {
    render(
      <EstadisticasScreen
        ingresoFijo={20000}
        ingresoTotal={20000}
        totalGastos={500}
        totalPresupuestado={3000}
        ahorro={null}
        disponibleParaPresupuestar={17000}
        presupuestos={presupuestos}
        onVolver={vi.fn()}
      />
    );

    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('Sin definir')).toBeInTheDocument();
  });

  it('llama a onVolver al hacer click en el botón de volver', () => {
    const onVolver = vi.fn();
    render(
      <EstadisticasScreen
        ingresoFijo={0}
        ingresoTotal={0}
        totalGastos={0}
        totalPresupuestado={0}
        ahorro={null}
        disponibleParaPresupuestar={0}
        presupuestos={[]}
        onVolver={onVolver}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(onVolver).toHaveBeenCalled();
  });

  it('muestra el mensaje vacío cuando no hay presupuestos por categoría', () => {
    render(
      <EstadisticasScreen
        ingresoFijo={0}
        ingresoTotal={0}
        totalGastos={0}
        totalPresupuestado={0}
        ahorro={null}
        disponibleParaPresupuestar={0}
        presupuestos={[]}
        onVolver={vi.fn()}
      />
    );

    expect(screen.getByText('Aún no tienes presupuestos por categoría este mes.')).toBeInTheDocument();
  });
});
