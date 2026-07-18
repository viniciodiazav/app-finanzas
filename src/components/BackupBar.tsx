import { useRef } from 'react';

interface BackupBarProps {
  onExportar: () => void;
  onImportar: (archivo: File) => void;
}

export function BackupBar({ onExportar, onImportar }: BackupBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-center gap-4 py-3 text-xs text-slate-500">
      <button onClick={onExportar} className="hover:text-brand-600 underline underline-offset-2">
        Exportar respaldo
      </button>
      <span className="text-slate-300">|</span>
      <button
        onClick={() => inputRef.current?.click()}
        className="hover:text-accent-600 underline underline-offset-2"
      >
        Importar respaldo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) onImportar(archivo);
          e.target.value = '';
        }}
      />
    </div>
  );
}
