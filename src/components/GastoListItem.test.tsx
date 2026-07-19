import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GastoListItem } from './GastoListItem';
import type { Gasto } from '../types/finanzas';

function gasto(overrides: Partial<Gasto> = {}): Gasto {
  return {
    id: 'g1',
    monto: 350,
    descripcion: 'Supermercado',
    categoriaId: 'comida',
    fecha: '2026-07-15T00:00:00.000Z',
    esFijo: false,
    ...overrides,
  };
}

describe('GastoListItem', () => {
  it('muestra la descripción, el monto formateado y el subtítulo', () => {
    render(<GastoListItem gasto={gasto()} subtitulo={<p>Comida</p>} onEliminar={vi.fn()} />);

    expect(screen.getByText('Supermercado')).toBeInTheDocument();
    expect(screen.getByText('$350.00')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('llama a onEliminar con el gasto al hacer click en el botón de eliminar', () => {
    const onEliminar = vi.fn();
    const g = gasto();
    render(<GastoListItem gasto={g} onEliminar={onEliminar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar gasto' }));
    expect(onEliminar).toHaveBeenCalledWith(g);
  });
});
