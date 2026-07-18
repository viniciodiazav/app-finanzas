import { etiquetaMes, esMesFuturo } from '../utils/mes';

interface HeaderProps {
  claveMes: string;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
}

export function Header({ claveMes, onMesAnterior, onMesSiguiente }: HeaderProps) {
  const hoy = new Date();
  const diaSemana = hoy.toLocaleDateString('es-ES', { weekday: 'short' });
  const diaNumero = hoy.getDate();

  return (
    <header className="bg-brand-700 text-white px-3 py-2.5 sm:px-6 rounded-b-2xl shadow-md flex items-center justify-between">
      <button
        onClick={onMesAnterior}
        aria-label="Mes anterior"
        className="text-lg px-2 py-1 rounded-lg hover:bg-white/15 active:bg-white/25"
      >
        ‹
      </button>

      <div className="flex items-baseline gap-2">
        <h1 className="text-lg sm:text-xl font-bold capitalize">{etiquetaMes(claveMes)}</h1>
        <span className="text-xs opacity-80 capitalize">{diaSemana} {diaNumero}</span>
        {esMesFuturo(claveMes) && (
          <span className="text-[10px] opacity-80 bg-white/15 px-1.5 py-0.5 rounded-full">Futuro</span>
        )}
      </div>

      <button
        onClick={onMesSiguiente}
        aria-label="Mes siguiente"
        className="text-lg px-2 py-1 rounded-lg hover:bg-white/15 active:bg-white/25"
      >
        ›
      </button>
    </header>
  );
}
