import type { PresupuestoDetalle } from '../../types/finanzas';
import { formatoMoneda } from '../../utils/formato';

interface InsightsListProps {
  totalGastos: number;
  presupuestos: PresupuestoDetalle[];
  gastoMesAnterior: number | null;
  presupuestoSinUsar: number;
}

export function InsightsList({ totalGastos, presupuestos, gastoMesAnterior, presupuestoSinUsar }: InsightsListProps) {
  const categoriaMayorGasto = [...presupuestos].sort((a, b) => b.gastado - a.gastado)[0];
  const categoriasExcedidas = presupuestos.filter((p) => p.sobregasto);

  const diferenciaVsMesAnterior = gastoMesAnterior !== null ? totalGastos - gastoMesAnterior : null;
  const porcentajeVsMesAnterior =
    gastoMesAnterior !== null && gastoMesAnterior > 0
      ? (diferenciaVsMesAnterior! / gastoMesAnterior) * 100
      : null;

  return (
    <ul className="flex flex-col gap-3 text-sm text-slate-600">
      {categoriaMayorGasto && categoriaMayorGasto.gastado > 0 && (
        <li>
          Tu categoría con más gasto fue{' '}
          <span className="font-semibold text-slate-800">{categoriaMayorGasto.nombreCategoria}</span>, con{' '}
          {formatoMoneda(categoriaMayorGasto.gastado)}
          {totalGastos > 0 && ` (${((categoriaMayorGasto.gastado / totalGastos) * 100).toFixed(0)}% de tu gasto total)`}.
        </li>
      )}

      {categoriasExcedidas.length === 0 ? (
        <li>Ningún presupuesto por categoría se excedió este mes.</li>
      ) : (
        <li>
          Excediste el presupuesto en{' '}
          <span className="font-semibold text-red-600">
            {categoriasExcedidas.map((p) => p.nombreCategoria).join(', ')}
          </span>
          .
        </li>
      )}

      {diferenciaVsMesAnterior !== null && (
        <li>
          {diferenciaVsMesAnterior === 0 ? (
            'Gastaste lo mismo que el mes pasado.'
          ) : diferenciaVsMesAnterior > 0 ? (
            <>
              Gastaste {formatoMoneda(diferenciaVsMesAnterior)} más que el mes pasado
              {porcentajeVsMesAnterior !== null && ` (${porcentajeVsMesAnterior.toFixed(0)}% más)`}.
            </>
          ) : (
            <>
              Gastaste {formatoMoneda(Math.abs(diferenciaVsMesAnterior))} menos que el mes pasado
              {porcentajeVsMesAnterior !== null && ` (${Math.abs(porcentajeVsMesAnterior).toFixed(0)}% menos)`}.
            </>
          )}
        </li>
      )}

      {presupuestoSinUsar > 0 && (
        <li>Tienes {formatoMoneda(presupuestoSinUsar)} presupuestados que aún no has gastado.</li>
      )}
    </ul>
  );
}
