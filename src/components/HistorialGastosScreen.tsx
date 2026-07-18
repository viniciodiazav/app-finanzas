import { useState } from 'react';
import type { Categoria, Gasto } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import { ConfirmDialog } from './ConfirmDialog';
import { GastoListItem } from './GastoListItem';

interface HistorialGastosScreenProps {
  gastos: Gasto[];
  categorias: Categoria[];
  onVolver: () => void;
  onEliminarGasto: (id: string) => void;
}

export function HistorialGastosScreen({
  gastos,
  categorias,
  onVolver,
  onEliminarGasto,
}: HistorialGastosScreenProps) {
  const nombreCategoria = (id: string) =>
    categorias.find((c) => c.id === id)?.nombre ?? 'Sin categoría';

  const gastosOrdenados = [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const total = gastos.reduce((acc, g) => acc + g.monto, 0);
  const [gastoAEliminar, setGastoAEliminar] = useState<Gasto | null>(null);

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
          <h1 className="text-lg font-bold">Historial de gastos</h1>
        </header>

        <main className="flex flex-col gap-4 px-4 mt-4">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total del mes</p>
            <p className="text-2xl font-bold text-slate-800">{formatoMoneda(total)}</p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            {gastosOrdenados.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aún no hay gastos registrados este mes.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {gastosOrdenados.map((gasto) => (
                  <GastoListItem
                    key={gasto.id}
                    gasto={gasto}
                    subtitulo={
                      <p className="text-xs text-slate-500">
                        {nombreCategoria(gasto.categoriaId)}
                        {gasto.esFijo && <span className="ml-1 text-accent-600">· Fijo</span>}
                      </p>
                    }
                    onEliminar={setGastoAEliminar}
                  />
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {gastoAEliminar && (
        <ConfirmDialog
          mensaje={`¿Eliminar el gasto "${gastoAEliminar.descripcion}" de ${formatoMoneda(gastoAEliminar.monto)}?`}
          onConfirmar={() => {
            onEliminarGasto(gastoAEliminar.id);
            setGastoAEliminar(null);
          }}
          onCancelar={() => setGastoAEliminar(null)}
        />
      )}
    </div>
  );
}
