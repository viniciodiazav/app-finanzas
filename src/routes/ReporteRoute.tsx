import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { ReporteMensualScreen } from '../components/ReporteMensualScreen';
import { sumarMeses } from '../utils/mes';

interface ReporteRouteProps {
  finanzas: UseFinanzasReturn;
}

export function ReporteRoute({ finanzas }: ReporteRouteProps) {
  const navigate = useNavigate();
  const { data, claveMes, ingresoTotal, totalGastos, ahorroDetalle, presupuestosDetalle } = finanzas;

  const mesAnterior = data.meses[sumarMeses(claveMes, -1)];
  const gastoMesAnterior = mesAnterior
    ? mesAnterior.gastos.reduce((acc, g) => acc + g.monto, 0)
    : null;

  return (
    <ReporteMensualScreen
      claveMes={claveMes}
      ingresoTotal={ingresoTotal}
      totalGastos={totalGastos}
      ahorro={ahorroDetalle}
      presupuestos={presupuestosDetalle}
      gastoMesAnterior={gastoMesAnterior}
      onVolver={() => navigate('/')}
    />
  );
}
