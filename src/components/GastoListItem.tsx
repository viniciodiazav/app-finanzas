import type { ReactNode } from 'react';
import type { Gasto } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';

interface GastoListItemProps {
  gasto: Gasto;
  subtitulo?: ReactNode;
  onEliminar: (gasto: Gasto) => void;
}

export function GastoListItem({ gasto, subtitulo, onEliminar }: GastoListItemProps) {
  return (
    <li className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="min-w-0">
        <p className="font-medium text-slate-800 truncate">{gasto.descripcion}</p>
        {subtitulo}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-slate-800">{formatoMoneda(gasto.monto)}</span>
        <button
          onClick={() => onEliminar(gasto)}
          aria-label="Eliminar gasto"
          className="text-slate-400 hover:text-red-500 text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </li>
  );
}
