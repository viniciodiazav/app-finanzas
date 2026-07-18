import type { PresupuestoDetalle } from '../../types/finanzas';
import { formatoMoneda } from '../../utils/formato';
import {
  COLOR_ESTADO_BIEN,
  COLOR_ESTADO_CRITICO,
  COLOR_TRACK_CLARO,
} from '../../utils/paletaCategorica';

interface BarraPresupuestoCategoriaProps {
  presupuesto: PresupuestoDetalle;
}

export function BarraPresupuestoCategoria({ presupuesto: p }: BarraPresupuestoCategoriaProps) {
  const porcentajeUsado = p.monto > 0 ? (p.gastado / p.monto) * 100 : 0;
  const anchoFill = Math.min(porcentajeUsado, 100);
  const colorFill = p.sobregasto ? COLOR_ESTADO_CRITICO : COLOR_ESTADO_BIEN;

  return (
    <li>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{p.nombreCategoria}</span>
        <span className="text-xs text-slate-500">
          {formatoMoneda(p.gastado)} / {formatoMoneda(p.monto)}
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: COLOR_TRACK_CLARO }}
        role="img"
        aria-label={`${p.nombreCategoria}: ${porcentajeUsado.toFixed(0)}% del presupuesto usado`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${anchoFill}%`, backgroundColor: colorFill }}
        />
      </div>
      <p
        className="text-xs mt-1"
        style={{ color: p.sobregasto ? COLOR_ESTADO_CRITICO : '#52514e' }}
      >
        {p.sobregasto
          ? `Excedido ${(porcentajeUsado - 100).toFixed(0)}% sobre el presupuesto`
          : `${porcentajeUsado.toFixed(0)}% usado`}
      </p>
    </li>
  );
}
