import type { PresupuestoDetalle } from '../../types/finanzas';
import { formatoMoneda } from '../../utils/formato';
import { colorParaIndice } from '../../utils/paletaCategorica';

interface DistribucionGastoPorCategoriaProps {
  presupuestos: PresupuestoDetalle[];
  totalGastos: number;
}

export function DistribucionGastoPorCategoria({ presupuestos, totalGastos }: DistribucionGastoPorCategoriaProps) {
  if (totalGastos <= 0) {
    return <p className="text-sm text-slate-400 text-center py-6">Aún no hay gastos registrados este mes.</p>;
  }

  const conGasto = presupuestos.filter((p) => p.gastado > 0);

  return (
    <>
      <div className="flex w-full h-6 rounded-full overflow-hidden gap-0.5">
        {conGasto.map((p, i) => {
          const porcentaje = (p.gastado / totalGastos) * 100;
          return (
            <div
              key={p.id}
              style={{ width: `${porcentaje}%`, backgroundColor: colorParaIndice(i) }}
              title={`${p.nombreCategoria}: ${formatoMoneda(p.gastado)}`}
            />
          );
        })}
      </div>
      <ul className="flex flex-col gap-1.5 mt-3">
        {conGasto.map((p, i) => (
          <li key={p.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colorParaIndice(i) }}
              />
              {p.nombreCategoria}
            </span>
            <span className="text-slate-500">
              {formatoMoneda(p.gastado)} ({((p.gastado / totalGastos) * 100).toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
