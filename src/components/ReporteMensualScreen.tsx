import type { AhorroDetalle, PresupuestoDetalle } from '../types/finanzas';
import { estadoTemporalMes, etiquetaMes } from '../utils/mes';
import { formatoMoneda } from '../utils/formato';

interface ReporteMensualScreenProps {
  claveMes: string;
  ingresoTotal: number;
  totalGastos: number;
  ahorro: AhorroDetalle | null;
  presupuestos: PresupuestoDetalle[];
  gastoMesAnterior: number | null;
  onVolver: () => void;
}

function fraseDisponible(estado: 'pasado' | 'actual' | 'futuro', restante: number): string {
  const positivo = restante >= 0;
  if (estado === 'futuro') {
    return positivo
      ? 'Si mantienes este plan, te quedarían disponibles'
      : 'Con este plan, ya irías en negativo por';
  }
  if (estado === 'pasado') {
    return positivo ? 'Te sobraron' : 'Terminaste el mes en negativo por';
  }
  return positivo ? 'Hasta ahora te sobran' : 'Hasta ahora vas en negativo por';
}

export function ReporteMensualScreen({
  claveMes,
  ingresoTotal,
  totalGastos,
  ahorro,
  presupuestos,
  gastoMesAnterior,
  onVolver,
}: ReporteMensualScreenProps) {
  const estado = estadoTemporalMes(claveMes);
  const restante = ingresoTotal - totalGastos;
  const positivo = restante >= 0;

  const tasaAhorro = ingresoTotal > 0 ? (restante / ingresoTotal) * 100 : 0;

  const presupuestoSinUsar = presupuestos.reduce((acc, p) => acc + Math.max(p.restante, 0), 0);

  const categoriaMayorGasto = [...presupuestos].sort((a, b) => b.gastado - a.gastado)[0];
  const categoriasExcedidas = presupuestos.filter((p) => p.sobregasto);

  const diferenciaVsMesAnterior = gastoMesAnterior !== null ? totalGastos - gastoMesAnterior : null;
  const porcentajeVsMesAnterior =
    gastoMesAnterior !== null && gastoMesAnterior > 0
      ? (diferenciaVsMesAnterior! / gastoMesAnterior) * 100
      : null;

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
          <h1 className="text-lg font-bold">Reporte mensual</h1>
        </header>

        <main className="flex flex-col gap-4 px-4 mt-4">
          <section className={`rounded-2xl shadow-sm border p-4 text-center ${
            positivo ? 'bg-brand-50 border-brand-200' : 'bg-red-50 border-red-200'
          }`}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {etiquetaMes(claveMes)}
            </p>
            <p className="text-sm text-slate-600 mt-2">{fraseDisponible(estado, restante)}</p>
            <p className={`text-3xl font-bold mt-1 ${positivo ? 'text-brand-700' : 'text-red-600'}`}>
              {formatoMoneda(Math.abs(restante))}
            </p>
            {ingresoTotal > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {positivo
                  ? `Equivale al ${tasaAhorro.toFixed(0)}% de tu ingreso total`
                  : `Equivale al ${Math.abs(tasaAhorro).toFixed(0)}% de tu ingreso total`}
              </p>
            )}
          </section>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingreso total</p>
              <p className="text-lg font-semibold text-brand-700 mt-1">{formatoMoneda(ingresoTotal)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total gastado</p>
              <p className="text-lg font-semibold text-accent-700 mt-1">{formatoMoneda(totalGastos)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ahorro planeado</p>
              <p className="text-lg font-semibold text-pink-600 mt-1">
                {ahorro ? formatoMoneda(ahorro.monto) : 'Sin definir'}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Presupuesto sin usar</p>
              <p className="text-lg font-semibold text-slate-800 mt-1">{formatoMoneda(presupuestoSinUsar)}</p>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Datos que te pueden ayudar
            </h2>
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
                <li>
                  Tienes {formatoMoneda(presupuestoSinUsar)} presupuestados que aún no has gastado.
                </li>
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
