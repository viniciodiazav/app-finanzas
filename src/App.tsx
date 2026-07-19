import { Route, Routes } from 'react-router-dom';
import { useFinanzas } from './hooks/useFinanzas';
import { DashboardRoute } from './routes/DashboardRoute';
import { PresupuestoDetalleRoute } from './routes/PresupuestoDetalleRoute';
import { EstadisticasRoute } from './routes/EstadisticasRoute';
import { HistorialRoute } from './routes/HistorialRoute';
import { ReporteRoute } from './routes/ReporteRoute';
import { CategoriasRoute } from './routes/CategoriasRoute';

interface AppProps {
  userId: string;
  onCerrarSesion: () => Promise<void>;
}

function App({ userId, onCerrarSesion }: AppProps) {
  const finanzas = useFinanzas(userId);

  if (finanzas.cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Cargando tus datos...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardRoute finanzas={finanzas} onCerrarSesion={onCerrarSesion} />} />
      <Route path="/presupuestos/:id" element={<PresupuestoDetalleRoute finanzas={finanzas} />} />
      <Route path="/estadisticas" element={<EstadisticasRoute finanzas={finanzas} />} />
      <Route path="/historial" element={<HistorialRoute finanzas={finanzas} />} />
      <Route path="/reporte" element={<ReporteRoute finanzas={finanzas} />} />
      <Route path="/categorias" element={<CategoriasRoute finanzas={finanzas} />} />
    </Routes>
  );
}

export default App;
