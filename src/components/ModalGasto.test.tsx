import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalGasto } from './ModalGasto';

describe('ModalGasto', () => {
  it('valida monto y descripción antes de guardar', () => {
    const onGuardar = vi.fn();
    render(<ModalGasto categoriaId="c1" onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.click(screen.getByText('Guardar gasto'));
    expect(screen.getByText('Ingresa un monto válido mayor a 0.')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('exige una descripción cuando el monto es válido', () => {
    render(<ModalGasto categoriaId="c1" onGuardar={vi.fn()} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
    fireEvent.click(screen.getByText('Guardar gasto'));

    expect(screen.getByText('Ingresa una descripción para el gasto.')).toBeInTheDocument();
  });

  it('guarda el gasto y cierra el modal cuando los datos son válidos', () => {
    const onGuardar = vi.fn();
    const onCerrar = vi.fn();
    render(<ModalGasto categoriaId="c1" onGuardar={onGuardar} onCerrar={onCerrar} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '350' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Supermercado'), { target: { value: 'Super' } });
    fireEvent.click(screen.getByText('Guardar gasto'));

    expect(onGuardar).toHaveBeenCalledWith(350, 'Super', 'c1');
    expect(onCerrar).toHaveBeenCalled();
  });
});
