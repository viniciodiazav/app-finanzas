import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AhorroSeccion } from './AhorroSeccion';

describe('AhorroSeccion', () => {
  it('muestra el botón de definir ahorro cuando no hay ahorro', () => {
    const onDefinirAhorro = vi.fn();
    render(<AhorroSeccion ahorro={null} onDefinirAhorro={onDefinirAhorro} onEliminarAhorro={vi.fn()} />);

    fireEvent.click(screen.getByText('+ Definir ahorro'));
    expect(onDefinirAhorro).toHaveBeenCalled();
  });

  it('muestra el monto y porcentaje cuando hay ahorro definido', () => {
    render(
      <AhorroSeccion
        ahorro={{ modo: 'monto', valor: 1000, monto: 1000, porcentaje: 5 }}
        onDefinirAhorro={vi.fn()}
        onEliminarAhorro={vi.fn()}
      />
    );

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText(/5.0% del ingreso fijo/)).toBeInTheDocument();
  });

  it('pide confirmación antes de eliminar el ahorro', () => {
    const onEliminarAhorro = vi.fn();
    render(
      <AhorroSeccion
        ahorro={{ modo: 'monto', valor: 1000, monto: 1000, porcentaje: 5 }}
        onDefinirAhorro={vi.fn()}
        onEliminarAhorro={onEliminarAhorro}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText(/¿Eliminar el ahorro mensual de \$1,000.00\?/)).toBeInTheDocument();
    expect(onEliminarAhorro).not.toHaveBeenCalled();

    const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(botonesEliminar[botonesEliminar.length - 1]);
    expect(onEliminarAhorro).toHaveBeenCalled();
  });
});
