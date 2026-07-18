import { useState } from 'react';
import { Modal } from './Modal';
import { formatoMoneda } from '../utils/formato';

interface ModalIngresoFijoProps {
  onGuardar: (monto: number) => { ok: boolean; error?: string };
  onCerrar: () => void;
}

export function ModalIngresoFijo({ onGuardar, onCerrar }: ModalIngresoFijoProps) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [confirmando, setConfirmando] = useState(false);

  const valorNumerico = Number(monto);

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Ingresa un monto válido mayor a 0.');
      return;
    }
    setError('');
    setConfirmando(true);
  };

  const handleConfirmar = () => {
    const resultado = onGuardar(valorNumerico);
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el ingreso fijo.');
      setConfirmando(false);
      return;
    }
    onCerrar();
  };

  if (confirmando) {
    return (
      <Modal titulo="Confirmar ingreso fijo mensual" onCerrar={onCerrar}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Estás a punto de definir tu ingreso fijo mensual en{' '}
            <span className="font-bold text-brand-700">{formatoMoneda(valorNumerico)}</span>.
          </p>
          <p className="text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
            Una vez guardado, no podrás editarlo. Este valor es único para este mes y no afecta a otros meses.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              className="flex-1 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal titulo="Definir ingreso fijo mensual" onCerrar={onCerrar}>
      <form onSubmit={handleContinuar} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Monto mensual</label>
          <input
            type="number"
            step="0.01"
            autoFocus
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="0.00"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <p className="text-xs text-slate-400">
          Este monto no podrá editarse después de guardarlo, y solo aplica a este mes.
        </p>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
        >
          Continuar
        </button>
      </form>
    </Modal>
  );
}
