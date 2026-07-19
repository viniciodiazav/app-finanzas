import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalPresupuestoCategoria } from './ModalPresupuestoCategoria';
import type { Categoria, PresupuestoDetalle } from '../types/finanzas';

const categorias: Categoria[] = [{ id: 'c1', nombre: 'Comida' }];

describe('ModalPresupuestoCategoria', () => {
  it('crea una categoría nueva y guarda el presupuesto para ella', () => {
    const onCrearCategoria = vi.fn().mockReturnValue({ ok: true, id: 'nuevo-id' });
    const onGuardarNuevo = vi.fn().mockReturnValue({ ok: true, id: 'p1' });
    const onCerrar = vi.fn();
    render(
      <ModalPresupuestoCategoria
        categorias={categorias}
        ingresoFijo={20000}
        disponibleParaPresupuestar={10000}
        onCrearCategoria={onCrearCategoria}
        onGuardarNuevo={onGuardarNuevo}
        onGuardarEdicion={vi.fn()}
        onCerrar={onCerrar}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Ej. Comida, Transporte...'), {
      target: { value: 'Ocio' },
    });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onCrearCategoria).toHaveBeenCalledWith('Ocio');
    expect(onGuardarNuevo).toHaveBeenCalledWith('nuevo-id', 'monto', 1000);
    expect(onCerrar).toHaveBeenCalled();
  });

  it('exige el nombre de la categoría cuando se crea un presupuesto nuevo', () => {
    render(
      <ModalPresupuestoCategoria
        categorias={categorias}
        ingresoFijo={20000}
        disponibleParaPresupuestar={10000}
        onCrearCategoria={vi.fn()}
        onGuardarNuevo={vi.fn()}
        onGuardarEdicion={vi.fn()}
        onCerrar={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('Ingresa el nombre de la categoría.')).toBeInTheDocument();
  });

  it('en modo edición muestra el nombre de la categoría como texto fijo y llama a onGuardarEdicion', () => {
    const presupuestoExistente: PresupuestoDetalle = {
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
    };
    const onGuardarEdicion = vi.fn().mockReturnValue({ ok: true });
    const onCerrar = vi.fn();
    render(
      <ModalPresupuestoCategoria
        presupuestoExistente={presupuestoExistente}
        categorias={categorias}
        ingresoFijo={20000}
        disponibleParaPresupuestar={10000}
        onCrearCategoria={vi.fn()}
        onGuardarNuevo={vi.fn()}
        onGuardarEdicion={onGuardarEdicion}
        onCerrar={onCerrar}
      />
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Ej. Comida, Transporte...')).not.toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('3000'), { target: { value: '3500' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onGuardarEdicion).toHaveBeenCalledWith('p1', 'monto', 3500);
    expect(onCerrar).toHaveBeenCalled();
  });

  it('cambia a modo porcentaje y muestra el equivalente en dinero', () => {
    render(
      <ModalPresupuestoCategoria
        categorias={categorias}
        ingresoFijo={20000}
        disponibleParaPresupuestar={10000}
        onCrearCategoria={vi.fn()}
        onGuardarNuevo={vi.fn()}
        onGuardarEdicion={vi.fn()}
        onCerrar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Porcentaje'));
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '10' } });

    expect(screen.getByText(/Equivale aprox\. a \$2,000\.00/)).toBeInTheDocument();
  });
});
