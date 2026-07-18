import { Route, Routes } from 'react-router-dom';
import { useFinanzas } from './hooks/useFinanzas';
import { DashboardRoute } from './routes/DashboardRoute';
import { PresupuestoDetalleRoute } from './routes/PresupuestoDetalleRoute';
import { EstadisticasRoute } from './routes/EstadisticasRoute';
import { HistorialRoute } from './routes/HistorialRoute';
import { ReporteRoute } from './routes/ReporteRoute';

function App() {
  const finanzas = useFinanzas();

  return (
    <Routes>
      <Route path="/" element={<DashboardRoute finanzas={finanzas} />} />
      <Route path="/presupuestos/:id" element={<PresupuestoDetalleRoute finanzas={finanzas} />} />
      <Route path="/estadisticas" element={<EstadisticasRoute finanzas={finanzas} />} />
      <Route path="/historial" element={<HistorialRoute finanzas={finanzas} />} />
      <Route path="/reporte" element={<ReporteRoute finanzas={finanzas} />} />
    </Routes>
  );
}

export default App;
