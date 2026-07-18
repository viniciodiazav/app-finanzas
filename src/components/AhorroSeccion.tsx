import { useState } from 'react';
import type { AhorroDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import { ConfirmDialog } from './ConfirmDialog';

interface AhorroSeccionProps {
  ahorro: AhorroDetalle | null;
  onDefinirAhorro: () => void;
  onEliminarAhorro: () => void;
}

export function AhorroSeccion({ ahorro, onDefinirAhorro, onEliminarAhorro }: AhorroSeccionProps) {
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ahorro mensual</p>
        {ahorro && (
          <div className="flex gap-3">
            <button onClick={onDefinirAhorro} className="text-xs text-slate-400 hover:text-slate-600">
              Editar
            </button>
            <button onClick={() => setConfirmandoEliminar(true)} className="text-xs text-red-400 hover:text-red-600">
              Eliminar
            </button>
          </div>
        )}
      </div>

      {ahorro ? (
        <p className="text-2xl font-bold text-pink-600 mt-1">
          {formatoMoneda(ahorro.monto)}
          <span className="text-sm font-medium text-slate-400 ml-1">
            ({ahorro.porcentaje.toFixed(1)}% del ingreso fijo)
          </span>
        </p>
      ) : (
        <button
          onClick={onDefinirAhorro}
          className="mt-1 text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          + Definir ahorro
        </button>
      )}

      {confirmandoEliminar && ahorro && (
        <ConfirmDialog
          mensaje={`¿Eliminar el ahorro mensual de ${formatoMoneda(ahorro.monto)}?`}
          onConfirmar={() => {
            onEliminarAhorro();
            setConfirmandoEliminar(false);
          }}
          onCancelar={() => setConfirmandoEliminar(false)}
        />
      )}
    </section>
  );
}
