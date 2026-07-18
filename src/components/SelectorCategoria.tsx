import { useState } from 'react';
import type { Categoria } from '../types/finanzas';

interface SelectorCategoriaProps {
  categorias: Categoria[];
  categoriaId: string;
  onCambiarCategoriaId: (id: string) => void;
  onCrearCategoria?: (nombre: string) => { ok: boolean; error?: string; id?: string };
  permitirCrear?: boolean;
  mensajeVacio?: string;
}

export function SelectorCategoria({
  categorias,
  categoriaId,
  onCambiarCategoriaId,
  onCrearCategoria,
  permitirCrear = true,
  mensajeVacio = 'No hay categorías disponibles todavía.',
}: SelectorCategoriaProps) {
  const [creandoNueva, setCreandoNueva] = useState(false);
  const [nombreNueva, setNombreNueva] = useState('');
  const [error, setError] = useState('');

  const handleCrear = () => {
    if (!onCrearCategoria) return;
    const resultado = onCrearCategoria(nombreNueva);
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo crear la categoría.');
      return;
    }
    if (resultado.id) onCambiarCategoriaId(resultado.id);
    setCreandoNueva(false);
    setNombreNueva('');
    setError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">Categoría</label>

      {categorias.length === 0 && !permitirCrear && (
        <p className="text-sm text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mb-2">
          {mensajeVacio}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {categorias.map((c) => {
          const seleccionada = c.id === categoriaId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCambiarCategoriaId(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                seleccionada
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
              }`}
            >
              {seleccionada && <span className="text-xs">✓</span>}
              {c.nombre}
            </button>
          );
        })}

        {permitirCrear && !creandoNueva && (
          <button
            type="button"
            onClick={() => setCreandoNueva(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50"
          >
            <span className="text-base leading-none">+</span> Nueva categoría
          </button>
        )}
      </div>

      {permitirCrear && creandoNueva && (
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              placeholder="Nombre de la categoría"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleCrear}
              className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              Crear
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setCreandoNueva(false); setNombreNueva(''); setError(''); }}
            className="text-xs text-slate-400 hover:text-slate-600 self-start"
          >
            Cancelar
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
