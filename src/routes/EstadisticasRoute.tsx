import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { EstadisticasScreen } from '../components/EstadisticasScreen';

interface EstadisticasRouteProps {
  finanzas: UseFinanzasReturn;
}

export function EstadisticasRoute({ finanzas }: EstadisticasRouteProps) {
  const navigate = useNavigate();
  const {
    mesActual,
    ingresoTotal,
    totalGastos,
    totalPresupuestado,
    ahorroDetalle,
    disponibleParaPresupuestar,
    presupuestosDetalle,
  } = finanzas;

  return (
    <EstadisticasScreen
      ingresoFijo={mesActual.ingresoFijo}
      ingresoTotal={ingresoTotal}
      totalGastos={totalGastos}
      totalPresupuestado={totalPresupuestado}
      ahorro={ahorroDetalle}
      disponibleParaPresupuestar={disponibleParaPresupuestar}
      presupuestos={presupuestosDetalle}
      onVolver={() => navigate('/')}
    />
  );
}
