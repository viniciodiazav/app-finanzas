import type { ModoPresupuesto } from '../types/finanzas';

interface ModoValorToggleProps {
  modo: ModoPresupuesto;
  onCambiar: (modo: ModoPresupuesto) => void;
  colorActivo?: 'brand' | 'pink';
}

const ESTILOS_ACTIVOS: Record<'brand' | 'pink', string> = {
  brand: 'bg-brand-600 text-white border-brand-600',
  pink: 'bg-pink-600 text-white border-pink-600',
};

export function ModoValorToggle({ modo, onCambiar, colorActivo = 'brand' }: ModoValorToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onCambiar('monto')}
        className={`flex-1 text-sm font-semibold py-2 rounded-lg border ${
          modo === 'monto' ? ESTILOS_ACTIVOS[colorActivo] : 'bg-white text-slate-600 border-slate-200'
        }`}
      >
        Monto
      </button>
      <button
        type="button"
        onClick={() => onCambiar('porcentaje')}
        className={`flex-1 text-sm font-semibold py-2 rounded-lg border ${
          modo === 'porcentaje' ? ESTILOS_ACTIVOS[colorActivo] : 'bg-white text-slate-600 border-slate-200'
        }`}
      >
        Porcentaje
      </button>
    </div>
  );
}
