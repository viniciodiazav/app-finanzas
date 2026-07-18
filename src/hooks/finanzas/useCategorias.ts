import { useCallback } from 'react';
import { crearId } from './helpers';
import type { Persistir } from './types';

export function useCategorias(persistir: Persistir) {
  const agregarCategoria = useCallback((nombre: string): { ok: boolean; error?: string; id?: string } => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return { ok: false, error: 'El nombre no puede estar vacío.' };

    const nuevoId = crearId();
    let resultado: { ok: boolean; error?: string; id?: string } = { ok: true, id: nuevoId };
    persistir((prev) => {
      const yaExiste = prev.categorias.some(
        (c) => c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
      );
      if (yaExiste) {
        resultado = { ok: false, error: 'Ya existe una categoría con ese nombre.' };
        return prev;
      }
      return {
        ...prev,
        categorias: [...prev.categorias, { id: nuevoId, nombre: nombreLimpio }],
      };
    });
    return resultado;
  }, [persistir]);

  return { agregarCategoria };
}
