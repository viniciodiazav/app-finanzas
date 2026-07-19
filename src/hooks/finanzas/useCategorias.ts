import { useCallback, useMemo } from 'react';
import type { Categoria, FinanzasData } from '../../types/finanzas';
import { categoriaEstaEnUso, crearId } from './helpers';
import type { Persistir } from './types';

export interface CategoriaConUso extends Categoria {
  enUso: boolean;
}

export function useCategorias(data: FinanzasData, persistir: Persistir) {
  const agregarCategoria = useCallback((nombre: string): { ok: boolean; error?: string; id?: string } => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return { ok: false, error: 'El nombre no puede estar vacío.' };

    const yaExiste = data.categorias.some((c) => c.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (yaExiste) return { ok: false, error: 'Ya existe una categoría con ese nombre.' };

    const nuevoId = crearId();
    persistir((prev) => ({
      ...prev,
      categorias: [...prev.categorias, { id: nuevoId, nombre: nombreLimpio }],
    }));
    return { ok: true, id: nuevoId };
  }, [data.categorias, persistir]);

  const editarCategoria = useCallback((id: string, nombre: string): { ok: boolean; error?: string } => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return { ok: false, error: 'El nombre no puede estar vacío.' };

    const yaExiste = data.categorias.some(
      (c) => c.id !== id && c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
    );
    if (yaExiste) return { ok: false, error: 'Ya existe una categoría con ese nombre.' };

    persistir((prev) => ({
      ...prev,
      categorias: prev.categorias.map((c) => (c.id === id ? { ...c, nombre: nombreLimpio } : c)),
    }));
    return { ok: true };
  }, [data.categorias, persistir]);

  const eliminarCategoria = useCallback((id: string): { ok: boolean; error?: string } => {
    if (categoriaEstaEnUso(data, id)) {
      return { ok: false, error: 'No se puede eliminar: la categoría tiene presupuestos o gastos asociados.' };
    }
    persistir((prev) => ({
      ...prev,
      categorias: prev.categorias.filter((c) => c.id !== id),
    }));
    return { ok: true };
  }, [data, persistir]);

  const categoriasConUso: CategoriaConUso[] = useMemo(
    () => data.categorias.map((c) => ({ ...c, enUso: categoriaEstaEnUso(data, c.id) })),
    [data]
  );

  return { agregarCategoria, editarCategoria, eliminarCategoria, categoriasConUso };
}
