import { useState } from 'react';
import type { CategoriaConUso } from '../hooks/finanzas/useCategorias';
import { ConfirmDialog } from './ConfirmDialog';

interface CategoriasScreenProps {
  categorias: CategoriaConUso[];
  onVolver: () => void;
  onEditar: (id: string, nombre: string) => { ok: boolean; error?: string };
  onEliminar: (id: string) => { ok: boolean; error?: string };
}

export function CategoriasScreen({ categorias, onVolver, onEditar, onEliminar }: CategoriasScreenProps) {
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [errorEdicion, setErrorEdicion] = useState('');
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<CategoriaConUso | null>(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  const iniciarEdicion = (categoria: CategoriaConUso) => {
    setIdEditando(categoria.id);
    setNombreEditado(categoria.nombre);
    setErrorEdicion('');
  };

  const guardarEdicion = (id: string) => {
    const resultado = onEditar(id, nombreEditado);
    if (!resultado.ok) {
      setErrorEdicion(resultado.error ?? 'No se pudo guardar el nombre.');
      return;
    }
    setIdEditando(null);
    setErrorEdicion('');
  };

  const solicitarEliminar = (categoria: CategoriaConUso) => {
    if (categoria.enUso) {
      setErrorEliminar(`"${categoria.nombre}" tiene presupuestos o gastos asociados y no se puede eliminar.`);
      return;
    }
    setErrorEliminar('');
    setCategoriaAEliminar(categoria);
  };

  const confirmarEliminar = () => {
    if (!categoriaAEliminar) return;
    const resultado = onEliminar(categoriaAEliminar.id);
    if (!resultado.ok) {
      setErrorEliminar(resultado.error ?? 'No se pudo eliminar la categoría.');
    }
    setCategoriaAEliminar(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="max-w-lg mx-auto">
        <header className="bg-brand-700 text-white px-3 py-2.5 sm:px-6 rounded-b-2xl shadow-md flex items-center gap-2">
          <button
            onClick={onVolver}
            aria-label="Volver"
            className="text-lg px-2 py-1 rounded-lg hover:bg-white/15 active:bg-white/25"
          >
            ‹
          </button>
          <h1 className="text-lg font-bold">Categorías</h1>
        </header>

        <main className="flex flex-col gap-4 px-4 mt-4">
          {errorEliminar && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorEliminar}
            </p>
          )}

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            {categorias.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aún no has creado categorías.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {categorias.map((categoria) => (
                  <li
                    key={categoria.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    {idEditando === categoria.id ? (
                      <div className="flex-1 flex flex-col gap-1">
                        <input
                          autoFocus
                          value={nombreEditado}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {errorEdicion && <p className="text-xs text-red-500">{errorEdicion}</p>}
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => guardarEdicion(categoria.id)}
                            className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setIdEditando(null)}
                            className="text-xs text-slate-400 hover:text-slate-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-slate-800 truncate">{categoria.nombre}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => iniciarEdicion(categoria)}
                            className="text-xs text-slate-400 hover:text-slate-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => solicitarEliminar(categoria)}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {categoriaAEliminar && (
        <ConfirmDialog
          mensaje={`¿Eliminar la categoría "${categoriaAEliminar.nombre}"?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setCategoriaAEliminar(null)}
        />
      )}
    </div>
  );
}
