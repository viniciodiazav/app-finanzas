import { useNavigate } from 'react-router-dom';

export function NavegacionSecundaria() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => navigate('/reporte')}
        className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
      >
        Reporte
      </button>
      <button
        onClick={() => navigate('/estadisticas')}
        className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100"
      >
        Estadísticas
      </button>
      <button
        onClick={() => navigate('/historial')}
        className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      >
        Historial
      </button>
    </div>
  );
}
