import { useState } from 'react';
import type { Gasto, PresupuestoDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import { ConfirmDialog } from './ConfirmDialog';

interface PresupuestoDetalleScreenProps {
  presupuesto: PresupuestoDetalle;
  gastos: Gasto[];
  onVolver: () => void;
  onEditar: () => void;
  onEliminar: () => void;
  onAgregarGasto: () => void;
  onEliminarGasto: (id: string) => void;
}

export function PresupuestoDetalleScreen({
  presupuesto,
  gastos,
  onVolver,
  onEditar,
  onEliminar,
  onAgregarGasto,
  onEliminarGasto,
}: PresupuestoDetalleScreenProps) {
  const gastosOrdenados = [...gastos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const [confirmandoEliminarPresupuesto, setConfirmandoEliminarPresupuesto] = useState(false);
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
          <h1 className="text-lg font-bold truncate">{presupuesto.nombreCategoria}</h1>
        </header>

        <main className="flex flex-col gap-4 px-4 mt-4">
          <section
            className={`rounded-2xl shadow-sm border p-4 ${
              presupuesto.sobregasto ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Presupuesto</p>
              <div className="flex gap-3">
                <button onClick={onEditar} className="text-xs text-slate-400 hover:text-slate-600">Editar</button>
                <button
                  onClick={() => setConfirmandoEliminarPresupuesto(true)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {formatoMoneda(presupuesto.monto)}
              <span className="text-sm font-medium text-slate-400 ml-1">
                ({presupuesto.porcentaje.toFixed(1)}% del ingreso fijo)
              </span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Gastado: {formatoMoneda(presupuesto.gastado)}</p>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className={`font-semibold ${presupuesto.sobregasto ? 'text-red-600' : 'text-brand-700'}`}>
                {presupuesto.sobregasto ? 'Excedido en: ' : 'Restante: '}
                {formatoMoneda(Math.abs(presupuesto.restante))}
              </p>
              {presupuesto.sobregasto && (
                <p className="text-xs text-red-500 mt-1">
                  Has superado el presupuesto de esta categoría. Puedes seguir registrando gastos.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Gastos de la categoría</h2>
            </div>

            <button
              onClick={onAgregarGasto}
              className="w-full text-sm font-semibold py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 mb-4"
            >
              + Agregar gasto
            </button>

            {gastosOrdenados.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aún no hay gastos en esta categoría.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {gastosOrdenados.map((gasto) => (
                  <li
                    key={gasto.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{gasto.descripcion}</p>
                      {gasto.esFijo && <p className="text-xs text-accent-600">Fijo</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-semibold text-slate-800">{formatoMoneda(gasto.monto)}</span>
                      <button
                        onClick={() => setGastoAEliminar(gasto)}
                        aria-label="Eliminar gasto"
                        className="text-slate-400 hover:text-red-500 text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {confirmandoEliminarPresupuesto && (
        <ConfirmDialog
          mensaje={`¿Eliminar el presupuesto de "${presupuesto.nombreCategoria}"? Los gastos ya registrados no se borrarán.`}
          onConfirmar={() => {
            onEliminar();
            setConfirmandoEliminarPresupuesto(false);
          }}
          onCancelar={() => setConfirmandoEliminarPresupuesto(false)}
        />
      )}

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
