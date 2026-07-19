import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalGastoFijo } from './ModalGastoFijo';
import type { Categoria } from '../types/finanzas';

const categorias: Categoria[] = [{ id: 'c1', nombre: 'Comida' }];

describe('ModalGastoFijo', () => {
  it('exige seleccionar una categoría antes de guardar', () => {
    const onGuardar = vi.fn();
    render(<ModalGastoFijo categorias={categorias} onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '300' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Renta, Netflix, gimnasio'), {
      target: { value: 'Netflix' },
    });
    fireEvent.click(screen.getByText('Guardar gasto fijo'));

    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('guarda con duración indefinida (null) por defecto', () => {
    const onGuardar = vi.fn();
    const onCerrar = vi.fn();
    render(<ModalGastoFijo categorias={categorias} onGuardar={onGuardar} onCerrar={onCerrar} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '300' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Renta, Netflix, gimnasio'), {
      target: { value: 'Netflix' },
    });
    fireEvent.click(screen.getByText('Comida'));
    fireEvent.click(screen.getByText('Guardar gasto fijo'));

    expect(onGuardar).toHaveBeenCalledWith(300, 'Netflix', 'c1', null);
    expect(onCerrar).toHaveBeenCalled();
  });

  it('permite definir una duración limitada en meses', () => {
    const onGuardar = vi.fn();
    render(<ModalGastoFijo categorias={categorias} onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '300' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Renta, Netflix, gimnasio'), {
      target: { value: 'Netflix' },
    });
    fireEvent.click(screen.getByText('Comida'));
    fireEvent.click(screen.getByText('Por un periodo'));

    const inputDuracion = screen.getAllByRole('spinbutton')[1];
    fireEvent.change(inputDuracion, { target: { value: '2' } });
    fireEvent.click(screen.getByText('Guardar gasto fijo'));

    expect(onGuardar).toHaveBeenCalledWith(300, 'Netflix', 'c1', 2);
  });
});
