import { formatoMoneda } from '../utils/formato';

interface DonutIngresoProps {
  ingresoFijo: number;
  totalGastos: number;
  totalPresupuestado: number;
  montoAhorro: number;
  disponibleParaPresupuestar: number;
}

const COLOR_GASTADO = '#2a78d6';
const COLOR_RESTANTE_PRESUPUESTO = '#008300';
const COLOR_AHORRO = '#db2777';
const COLOR_SIN_PRESUPUESTAR = '#c3c2b7';

export function DonutIngreso({
  ingresoFijo,
  totalGastos,
  totalPresupuestado,
  montoAhorro,
  disponibleParaPresupuestar,
}: DonutIngresoProps) {
  if (ingresoFijo <= 0) return null;

  const gastado = Math.min(totalGastos, ingresoFijo);
  const restantePresupuesto = Math.max(totalPresupuestado - totalGastos, 0);
  const ahorro = montoAhorro;
  const sinPresupuestar = disponibleParaPresupuestar;
  const denom = Math.max(ingresoFijo, gastado + restantePresupuesto + ahorro + sinPresupuestar);

  const pctGastado = (gastado / denom) * 100;
  const pctRestante = (restantePresupuesto / denom) * 100;
  const pctAhorro = (ahorro / denom) * 100;
  const pctSinPresupuestar = (sinPresupuestar / denom) * 100;

  const gradiente = `conic-gradient(
    ${COLOR_GASTADO} 0% ${pctGastado}%,
    ${COLOR_RESTANTE_PRESUPUESTO} ${pctGastado}% ${pctGastado + pctRestante}%,
    ${COLOR_AHORRO} ${pctGastado + pctRestante}% ${pctGastado + pctRestante + pctAhorro}%,
    ${COLOR_SIN_PRESUPUESTAR} ${pctGastado + pctRestante + pctAhorro}% ${pctGastado + pctRestante + pctAhorro + pctSinPresupuestar}%
  )`;

  const excedido = totalGastos > totalPresupuestado;

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div
        className="w-16 h-16 rounded-full shrink-0"
        style={{ background: gradiente }}
        role="img"
        aria-label={`Del ingreso fijo: ${pctGastado.toFixed(0)}% gastado, ${pctRestante.toFixed(0)}% presupuestado sin gastar, ${pctAhorro.toFixed(0)}% ahorro, ${pctSinPresupuestar.toFixed(0)}% sin presupuestar`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white" />
        </div>
      </div>
      <ul className="flex flex-col gap-0.5 text-[11px] text-slate-600">
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_GASTADO }} />
          Gastado {formatoMoneda(gastado)}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_RESTANTE_PRESUPUESTO }} />
          Presupuestado {formatoMoneda(restantePresupuesto)}
        </li>
        {ahorro > 0 && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_AHORRO }} />
            Ahorro {formatoMoneda(ahorro)}
          </li>
        )}
        <li className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLOR_SIN_PRESUPUESTAR }} />
          Sin presupuestar {formatoMoneda(sinPresupuestar)}
        </li>
        {excedido && (
          <li className="text-red-500 mt-0.5">Gasto total supera lo presupuestado</li>
        )}
      </ul>
    </div>
  );
}
