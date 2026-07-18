import type { PresupuestoDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';

interface PresupuestosListaProps {
  presupuestos: PresupuestoDetalle[];
  totalPresupuestado: number;
  ingresoFijo: number;
  onAgregarPresupuesto: () => void;
  onVerDetalle: (id: string) => void;
}

export function PresupuestosLista({
  presupuestos,
  totalPresupuestado,
  ingresoFijo,
  onAgregarPresupuesto,
  onVerDetalle,
}: PresupuestosListaProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Presupuestos por categoría</h2>
      </div>

      {ingresoFijo > 0 && (
        <p className="text-xs text-slate-400 mb-3">
          Asignado: {formatoMoneda(totalPresupuestado)} de {formatoMoneda(ingresoFijo)}
        </p>
      )}

      <button
        onClick={onAgregarPresupuesto}
        className="w-full text-sm font-semibold py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 mb-3"
      >
        + Nuevo presupuesto
      </button>

      {presupuestos.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Aún no has definido presupuestos por categoría.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {presupuestos.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onVerDetalle(p.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2 ${
                  p.sobregasto ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 truncate">{p.nombreCategoria}</p>
                  <p className="text-xs text-slate-500">
                    {formatoMoneda(p.monto)} ({p.porcentaje.toFixed(1)}%) · Gastado: {formatoMoneda(p.gastado)}
                  </p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${p.sobregasto ? 'text-red-600' : 'text-brand-700'}`}>
                  {p.sobregasto ? '-' : ''}{formatoMoneda(Math.abs(p.restante))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
