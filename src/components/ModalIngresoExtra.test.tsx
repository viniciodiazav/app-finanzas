import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalIngresoExtra } from './ModalIngresoExtra';

describe('ModalIngresoExtra', () => {
  it('valida que el monto sea mayor a 0', () => {
    const onGuardar = vi.fn();
    render(<ModalIngresoExtra onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByText('Ingresa un monto válido mayor a 0.')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('usa "Ingreso extra" como descripción por defecto si se deja vacía', () => {
    const onGuardar = vi.fn();
    const onCerrar = vi.fn();
    render(<ModalIngresoExtra onGuardar={onGuardar} onCerrar={onCerrar} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onGuardar).toHaveBeenCalledWith(500, 'Ingreso extra');
    expect(onCerrar).toHaveBeenCalled();
  });

  it('usa la descripción provista cuando existe', () => {
    const onGuardar = vi.fn();
    render(<ModalIngresoExtra onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Bono, venta, freelance...'), {
      target: { value: 'Bono' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onGuardar).toHaveBeenCalledWith(500, 'Bono');
  });
});
