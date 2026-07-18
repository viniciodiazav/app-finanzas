import { useState } from 'react';
import { Modal } from './Modal';

interface ModalIngresoExtraProps {
  onGuardar: (monto: number, descripcion: string) => void;
  onCerrar: () => void;
}

export function ModalIngresoExtra({ onGuardar, onCerrar }: ModalIngresoExtraProps) {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(monto);
    if (!monto || isNaN(valor) || valor <= 0) {
      setError('Ingresa un monto válido mayor a 0.');
      return;
    }
    onGuardar(valor, descripcion.trim() || 'Ingreso extra');
    onCerrar();
  };

  return (
    <Modal titulo="Agregar ingreso extra" onCerrar={onCerrar}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Monto</label>
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
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descripción (opcional)</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Ej. Bono, venta, freelance..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-accent-600 text-white font-semibold hover:bg-accent-700"
        >
          Guardar
        </button>
      </form>
    </Modal>
  );
}
