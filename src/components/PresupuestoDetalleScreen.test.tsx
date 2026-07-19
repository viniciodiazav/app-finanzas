import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PresupuestoDetalleScreen } from './PresupuestoDetalleScreen';
import type { Gasto, PresupuestoDetalle } from '../types/finanzas';

const presupuesto: PresupuestoDetalle = {
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
};

const gastos: Gasto[] = [
  { id: 'g1', monto: 300, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
];

describe('PresupuestoDetalleScreen', () => {
  it('muestra el monto restante y la lista de gastos', () => {
    render(
      <PresupuestoDetalleScreen
        presupuesto={presupuesto}
        gastos={gastos}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
        onAgregarGasto={vi.fn()}
        onEliminarGasto={vi.fn()}
      />
    );

    expect(screen.getByText(/Restante:/)).toBeInTheDocument();
    expect(screen.getByText(/\$700\.00/)).toBeInTheDocument();
    expect(screen.getByText('Super')).toBeInTheDocument();
  });

  it('muestra el mensaje de sobregasto cuando aplica', () => {
    render(
      <PresupuestoDetalleScreen
        presupuesto={{ ...presupuesto, sobregasto: true, restante: -100, gastado: 1100 }}
        gastos={gastos}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
        onAgregarGasto={vi.fn()}
        onEliminarGasto={vi.fn()}
      />
    );

    expect(screen.getByText(/Excedido en:/)).toBeInTheDocument();
    expect(screen.getByText(/Has superado el presupuesto/)).toBeInTheDocument();
  });

  it('pide confirmación antes de eliminar el presupuesto', () => {
    const onEliminar = vi.fn();
    render(
      <PresupuestoDetalleScreen
        presupuesto={presupuesto}
        gastos={[]}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={onEliminar}
        onAgregarGasto={vi.fn()}
        onEliminarGasto={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText(/¿Eliminar el presupuesto de "Comida"\?/)).toBeInTheDocument();
    expect(onEliminar).not.toHaveBeenCalled();

    const botones = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(botones[botones.length - 1]);
    expect(onEliminar).toHaveBeenCalled();
  });

  it('pide confirmación antes de eliminar un gasto individual', () => {
    const onEliminarGasto = vi.fn();
    render(
      <PresupuestoDetalleScreen
        presupuesto={presupuesto}
        gastos={gastos}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
        onAgregarGasto={vi.fn()}
        onEliminarGasto={onEliminarGasto}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar gasto' }));
    expect(screen.getByText(/¿Eliminar el gasto "Super" de \$300.00\?/)).toBeInTheDocument();

    const botones = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(botones[botones.length - 1]);
    expect(onEliminarGasto).toHaveBeenCalledWith('g1');
  });

  it('llama a onEditar y onAgregarGasto', () => {
    const onEditar = vi.fn();
    const onAgregarGasto = vi.fn();
    render(
      <PresupuestoDetalleScreen
        presupuesto={presupuesto}
        gastos={[]}
        onVolver={vi.fn()}
        onEditar={onEditar}
        onEliminar={vi.fn()}
        onAgregarGasto={onAgregarGasto}
        onEliminarGasto={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(onEditar).toHaveBeenCalled();

    fireEvent.click(screen.getByText('+ Agregar gasto'));
    expect(onAgregarGasto).toHaveBeenCalled();
  });
});
