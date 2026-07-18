interface StatTileProps {
  etiqueta: string;
  valor: string;
  valorClassName?: string;
}

export function StatTile({ etiqueta, valor, valorClassName }: StatTileProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{etiqueta}</p>
      <p className={`text-xl font-semibold mt-1 ${valorClassName ?? 'text-slate-800'}`}>{valor}</p>
    </div>
  );
}
