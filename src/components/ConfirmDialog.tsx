import { Modal } from './Modal';

interface ConfirmDialogProps {
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  titulo = 'Confirmar eliminación',
  mensaje,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal titulo={titulo} onCerrar={onCancelar}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-600">{mensaje}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  );
}
