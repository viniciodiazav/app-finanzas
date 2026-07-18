interface GastoFijoSeccionProps {
  onAgregarGastoFijo: () => void;
}

export function GastoFijoSeccion({ onAgregarGastoFijo }: GastoFijoSeccionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <button
        onClick={onAgregarGastoFijo}
        className="w-full text-sm font-semibold py-2 rounded-lg bg-accent-600 text-white hover:bg-accent-700"
      >
        + Agregar gasto fijo
      </button>
    </section>
  );
}
