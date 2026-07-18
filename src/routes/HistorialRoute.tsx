import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { HistorialGastosScreen } from '../components/HistorialGastosScreen';

interface HistorialRouteProps {
  finanzas: UseFinanzasReturn;
}

export function HistorialRoute({ finanzas }: HistorialRouteProps) {
  const navigate = useNavigate();
  const { mesActual, categorias, eliminarGasto } = finanzas;

  return (
    <HistorialGastosScreen
      gastos={mesActual.gastos}
      categorias={categorias}
      onVolver={() => navigate('/')}
      onEliminarGasto={eliminarGasto}
    />
  );
}
