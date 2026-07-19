import { useRef, useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface BackupBarProps {
  onExportar: () => void;
  onImportar: (archivo: File) => void;
}

export function BackupBar({ onExportar, onImportar }: BackupBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivoPendiente, setArchivoPendiente] = useState<File | null>(null);

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
          if (archivo) setArchivoPendiente(archivo);
          e.target.value = '';
        }}
      />

      {archivoPendiente && (
        <ConfirmDialog
          titulo="Importar respaldo"
          mensaje={`Esto reemplazará todos tus datos actuales con el contenido de "${archivoPendiente.name}". Esta acción no se puede deshacer. ¿Continuar?`}
          textoConfirmar="Importar y reemplazar"
          onConfirmar={() => {
            onImportar(archivoPendiente);
            setArchivoPendiente(null);
          }}
          onCancelar={() => setArchivoPendiente(null)}
        />
      )}
    </div>
  );
}
