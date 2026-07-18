import type { AhorroDetalle, PresupuestoDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import {
  colorParaIndice,
  COLOR_ESTADO_BIEN,
  COLOR_ESTADO_CRITICO,
  COLOR_TRACK_CLARO,
} from '../utils/paletaCategorica';

interface EstadisticasScreenProps {
  ingresoFijo: number;
  ingresoTotal: number;
  totalGastos: number;
  totalPresupuestado: number;
  ahorro: AhorroDetalle | null;
  disponibleParaPresupuestar: number;
  presupuestos: PresupuestoDetalle[];
  onVolver: () => void;
}

function StatTile({ etiqueta, valor, valorClassName }: { etiqueta: string; valor: string; valorClassName?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{etiqueta}</p>
      <p className={`text-xl font-semibold mt-1 ${valorClassName ?? 'text-slate-800'}`}>{valor}</p>
    </div>
  );
}

export function EstadisticasScreen({
  ingresoFijo,
  ingresoTotal,
  totalGastos,
  totalPresupuestado,
  ahorro,
  disponibleParaPresupuestar,
  presupuestos,
  onVolver,
}: EstadisticasScreenProps) {
  const presupuestosOrdenados = [...presupuestos].sort((a, b) => b.gastado - a.gastado);
  const hayGastos = totalGastos > 0;

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
          <h1 className="text-lg font-bold">Estadísticas mensuales</h1>
        </header>

        <main className="flex flex-col gap-4 px-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <StatTile etiqueta="Ingreso total" valor={formatoMoneda(ingresoTotal)} valorClassName="text-brand-700" />
            <StatTile etiqueta="Total gastado" valor={formatoMoneda(totalGastos)} valorClassName="text-accent-700" />
            <StatTile etiqueta="Presupuestado" valor={formatoMoneda(totalPresupuestado)} />
            <StatTile
              etiqueta="Ahorro"
              valor={ahorro ? `${formatoMoneda(ahorro.monto)} (${ahorro.porcentaje.toFixed(1)}%)` : 'Sin definir'}
              valorClassName="text-pink-600"
            />
            <StatTile etiqueta="Sin presupuestar" valor={formatoMoneda(disponibleParaPresupuestar)} />
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Presupuesto vs. gastado por categoría
            </h2>
            {presupuestosOrdenados.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Aún no tienes presupuestos por categoría este mes.
              </p>
            ) : (
              <ul className="flex flex-col gap-4 mt-3">
                {presupuestosOrdenados.map((p) => {
                  const porcentajeUsado = p.monto > 0 ? (p.gastado / p.monto) * 100 : 0;
                  const anchoFill = Math.min(porcentajeUsado, 100);
                  const colorFill = p.sobregasto ? COLOR_ESTADO_CRITICO : COLOR_ESTADO_BIEN;
                  return (
                    <li key={p.id}>
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
                })}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Distribución del gasto por categoría
            </h2>
            {!hayGastos ? (
              <p className="text-sm text-slate-400 text-center py-6">Aún no hay gastos registrados este mes.</p>
            ) : (
              <>
                <div className="flex w-full h-6 rounded-full overflow-hidden gap-0.5">
                  {presupuestosOrdenados
                    .filter((p) => p.gastado > 0)
                    .map((p, i) => {
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
                  {presupuestosOrdenados
                    .filter((p) => p.gastado > 0)
                    .map((p, i) => (
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
            )}
          </section>

          <p className="text-xs text-slate-400 text-center">
            Ingreso fijo del mes: {formatoMoneda(ingresoFijo)}
          </p>
        </main>
      </div>
    </div>
  );
}
