import { useState } from 'react';
import type { IngresoExtra } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import { DonutIngreso } from './DonutIngreso';
import { ConfirmDialog } from './ConfirmDialog';

interface IngresoSeccionProps {
  ingresoFijo: number;
  ingresosExtra: IngresoExtra[];
  totalIngresosExtra: number;
  totalGastos: number;
  totalPresupuestado: number;
  montoAhorro: number;
  disponibleParaPresupuestar: number;
  onDefinirIngresoFijo: () => void;
  onAgregarIngresoExtra: () => void;
  onEliminarIngresoExtra: (id: string) => void;
}

export function IngresoSeccion({
  ingresoFijo,
  ingresosExtra,
  totalIngresosExtra,
  totalGastos,
  totalPresupuestado,
  montoAhorro,
  disponibleParaPresupuestar,
  onDefinirIngresoFijo,
  onAgregarIngresoExtra,
  onEliminarIngresoExtra,
}: IngresoSeccionProps) {
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const [ingresoAEliminar, setIngresoAEliminar] = useState<IngresoExtra | null>(null);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingreso fijo mensual</p>
          {ingresoFijo > 0 ? (
            <p className="text-2xl font-bold text-brand-700">{formatoMoneda(ingresoFijo)}</p>
          ) : (
            <button
              onClick={onDefinirIngresoFijo}
              className="mt-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              + Definir ingreso fijo
            </button>
          )}
        </div>
        <DonutIngreso
          ingresoFijo={ingresoFijo}
          totalGastos={totalGastos}
          totalPresupuestado={totalPresupuestado}
          montoAhorro={montoAhorro}
          disponibleParaPresupuestar={disponibleParaPresupuestar}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingresos extra</p>
            <p className="text-lg font-semibold text-accent-700">{formatoMoneda(totalIngresosExtra)}</p>
          </div>
          <button
            onClick={onAgregarIngresoExtra}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100"
          >
            + Ingreso extra
          </button>
        </div>

        {ingresosExtra.length > 0 && (
          <button
            onClick={() => setHistorialAbierto((v) => !v)}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600"
          >
            {historialAbierto ? 'Ocultar historial ▲' : `Ver historial (${ingresosExtra.length}) ▾`}
          </button>
        )}

        {historialAbierto && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {[...ingresosExtra].reverse().map((ingreso) => (
              <li
                key={ingreso.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm"
              >
                <div className="min-w-0">
                  <p className="text-slate-700 truncate">{ingreso.descripcion}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(ingreso.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-accent-700">{formatoMoneda(ingreso.monto)}</span>
                  <button
                    onClick={() => setIngresoAEliminar(ingreso)}
                    aria-label="Eliminar ingreso extra"
                    className="text-slate-400 hover:text-red-500 text-base leading-none"
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {ingresoAEliminar && (
        <ConfirmDialog
          mensaje={`¿Eliminar el ingreso extra "${ingresoAEliminar.descripcion}" de ${formatoMoneda(ingresoAEliminar.monto)}?`}
          onConfirmar={() => {
            onEliminarIngresoExtra(ingresoAEliminar.id);
            setIngresoAEliminar(null);
          }}
          onCancelar={() => setIngresoAEliminar(null)}
        />
      )}
    </section>
  );
}
