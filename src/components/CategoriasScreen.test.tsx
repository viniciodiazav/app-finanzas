import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoriasScreen } from './CategoriasScreen';
import type { CategoriaConUso } from '../hooks/finanzas/useCategorias';

function categorias(overrides: Partial<CategoriaConUso>[] = []): CategoriaConUso[] {
  return overrides.map((o, i) => ({
    id: o.id ?? `id-${i}`,
    nombre: o.nombre ?? `Categoría ${i}`,
    enUso: o.enUso ?? false,
  }));
}

describe('CategoriasScreen', () => {
  it('muestra un mensaje cuando no hay categorías', () => {
    render(
      <CategoriasScreen categorias={[]} onVolver={vi.fn()} onEditar={vi.fn()} onEliminar={vi.fn()} />
    );

    expect(screen.getByText('Aún no has creado categorías.')).toBeInTheDocument();
  });

  it('lista las categorías existentes', () => {
    render(
      <CategoriasScreen
        categorias={categorias([{ nombre: 'Comida' }, { nombre: 'Transporte' }])}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
      />
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();
  });

  it('permite renombrar una categoría', () => {
    const onEditar = vi.fn().mockReturnValue({ ok: true });
    render(
      <CategoriasScreen
        categorias={categorias([{ id: 'comida', nombre: 'Comida' }])}
        onVolver={vi.fn()}
        onEditar={onEditar}
        onEliminar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    const input = screen.getByDisplayValue('Comida');
    fireEvent.change(input, { target: { value: 'Comida y bebidas' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onEditar).toHaveBeenCalledWith('comida', 'Comida y bebidas');
  });

  it('muestra el error devuelto por onEditar y no cierra el modo edición', () => {
    const onEditar = vi.fn().mockReturnValue({ ok: false, error: 'Ya existe una categoría con ese nombre.' });
    render(
      <CategoriasScreen
        categorias={categorias([{ id: 'comida', nombre: 'Comida' }])}
        onVolver={vi.fn()}
        onEditar={onEditar}
        onEliminar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Comida')).toBeInTheDocument();
  });

  it('pide confirmación y elimina una categoría que no está en uso', () => {
    const onEliminar = vi.fn().mockReturnValue({ ok: true });
    render(
      <CategoriasScreen
        categorias={categorias([{ id: 'comida', nombre: 'Comida', enUso: false }])}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={onEliminar}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText('¿Eliminar la categoría "Comida"?')).toBeInTheDocument();

    const botonesEliminar = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(botonesEliminar[botonesEliminar.length - 1]);

    expect(onEliminar).toHaveBeenCalledWith('comida');
  });

  it('no permite eliminar una categoría en uso y muestra el motivo sin llamar a onEliminar', () => {
    const onEliminar = vi.fn();
    render(
      <CategoriasScreen
        categorias={categorias([{ id: 'comida', nombre: 'Comida', enUso: true }])}
        onVolver={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={onEliminar}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));

    expect(
      screen.getByText('"Comida" tiene presupuestos o gastos asociados y no se puede eliminar.')
    ).toBeInTheDocument();
    expect(screen.queryByText('¿Eliminar la categoría "Comida"?')).not.toBeInTheDocument();
    expect(onEliminar).not.toHaveBeenCalled();
  });

  it('llama a onVolver al hacer click en el botón de volver', () => {
    const onVolver = vi.fn();
    render(
      <CategoriasScreen categorias={[]} onVolver={onVolver} onEditar={vi.fn()} onEliminar={vi.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));

    expect(onVolver).toHaveBeenCalled();
  });
});
