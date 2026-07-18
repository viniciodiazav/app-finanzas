import type { AhorroDetalle, PresupuestoDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';
import { StatTile } from './StatTile';
import { BarraPresupuestoCategoria } from './estadisticas/BarraPresupuestoCategoria';
import { DistribucionGastoPorCategoria } from './estadisticas/DistribucionGastoPorCategoria';

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
                {presupuestosOrdenados.map((p) => (
                  <BarraPresupuestoCategoria key={p.id} presupuesto={p} />
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Distribución del gasto por categoría
            </h2>
            <DistribucionGastoPorCategoria presupuestos={presupuestosOrdenados} totalGastos={totalGastos} />
          </section>

          <p className="text-xs text-slate-400 text-center">
            Ingreso fijo del mes: {formatoMoneda(ingresoFijo)}
          </p>
        </main>
      </div>
    </div>
  );
}
