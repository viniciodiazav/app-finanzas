import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HistorialGastosScreen } from './HistorialGastosScreen';
import type { Categoria, Gasto } from '../types/finanzas';

const categorias: Categoria[] = [{ id: 'c1', nombre: 'Comida' }];
const gastos: Gasto[] = [
  { id: 'g1', monto: 300, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
  { id: 'g2', monto: 200, descripcion: 'Restaurante', categoriaId: 'c1', fecha: '2026-07-12T00:00:00.000Z', esFijo: true },
];

describe('HistorialGastosScreen', () => {
  it('muestra el total del mes y cada gasto con su categoría', () => {
    render(
      <HistorialGastosScreen gastos={gastos} categorias={categorias} onVolver={vi.fn()} onEliminarGasto={vi.fn()} />
    );

    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('Super')).toBeInTheDocument();
    expect(screen.getByText('Restaurante')).toBeInTheDocument();
    expect(screen.getAllByText(/Comida/).length).toBeGreaterThan(0);
  });

  it('marca los gastos fijos', () => {
    render(
      <HistorialGastosScreen gastos={gastos} categorias={categorias} onVolver={vi.fn()} onEliminarGasto={vi.fn()} />
    );

    expect(screen.getByText(/· Fijo/)).toBeInTheDocument();
  });

  it('muestra el mensaje vacío cuando no hay gastos', () => {
    render(<HistorialGastosScreen gastos={[]} categorias={categorias} onVolver={vi.fn()} onEliminarGasto={vi.fn()} />);

    expect(screen.getByText('Aún no hay gastos registrados este mes.')).toBeInTheDocument();
  });

  it('pide confirmación antes de eliminar un gasto', () => {
    const onEliminarGasto = vi.fn();
    render(
      <HistorialGastosScreen gastos={gastos} categorias={categorias} onVolver={vi.fn()} onEliminarGasto={onEliminarGasto} />
    );

    const filaSuper = screen.getByText('Super').closest('li')!;
    fireEvent.click(within(filaSuper).getByRole('button', { name: 'Eliminar gasto' }));
    expect(screen.getByText(/¿Eliminar el gasto "Super" de \$300.00\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onEliminarGasto).toHaveBeenCalledWith('g1');
  });
});
