import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectorCategoria } from './SelectorCategoria';
import type { Categoria } from '../types/finanzas';

const categorias: Categoria[] = [
  { id: 'c1', nombre: 'Comida' },
  { id: 'c2', nombre: 'Transporte' },
];

describe('SelectorCategoria', () => {
  it('llama a onCambiarCategoriaId al seleccionar una categoría existente', () => {
    const onCambiarCategoriaId = vi.fn();
    render(
      <SelectorCategoria categorias={categorias} categoriaId="" onCambiarCategoriaId={onCambiarCategoriaId} />
    );

    fireEvent.click(screen.getByText('Transporte'));
    expect(onCambiarCategoriaId).toHaveBeenCalledWith('c2');
  });

  it('muestra el mensaje vacío cuando no hay categorías y no se permite crear', () => {
    render(
      <SelectorCategoria
        categorias={[]}
        categoriaId=""
        onCambiarCategoriaId={vi.fn()}
        permitirCrear={false}
        mensajeVacio="No hay categorías todavía."
      />
    );

    expect(screen.getByText('No hay categorías todavía.')).toBeInTheDocument();
    expect(screen.queryByText('+ Nueva categoría')).not.toBeInTheDocument();
  });

  it('permite crear una categoría nueva y selecciona la creada', () => {
    const onCrearCategoria = vi.fn().mockReturnValue({ ok: true, id: 'nuevo-id' });
    const onCambiarCategoriaId = vi.fn();
    render(
      <SelectorCategoria
        categorias={categorias}
        categoriaId=""
        onCambiarCategoriaId={onCambiarCategoriaId}
        onCrearCategoria={onCrearCategoria}
      />
    );

    fireEvent.click(screen.getByText(/Nueva categoría/));
    fireEvent.change(screen.getByPlaceholderText('Nombre de la categoría'), {
      target: { value: 'Ocio' },
    });
    fireEvent.click(screen.getByText('Crear'));

    expect(onCrearCategoria).toHaveBeenCalledWith('Ocio');
    expect(onCambiarCategoriaId).toHaveBeenCalledWith('nuevo-id');
  });

  it('muestra el error cuando la creación de categoría falla', () => {
    const onCrearCategoria = vi.fn().mockReturnValue({ ok: false, error: 'Ya existe.' });
    render(
      <SelectorCategoria
        categorias={categorias}
        categoriaId=""
        onCambiarCategoriaId={vi.fn()}
        onCrearCategoria={onCrearCategoria}
      />
    );

    fireEvent.click(screen.getByText(/Nueva categoría/));
    fireEvent.change(screen.getByPlaceholderText('Nombre de la categoría'), {
      target: { value: 'Comida' },
    });
    fireEvent.click(screen.getByText('Crear'));

    expect(screen.getByText('Ya existe.')).toBeInTheDocument();
  });
});
