import { useState } from 'react';
import { Modal } from './Modal';

interface ModalGastoProps {
  categoriaId: string;
  onGuardar: (monto: number, descripcion: string, categoriaId: string) => void;
  onCerrar: () => void;
}

export function ModalGasto({ categoriaId, onGuardar, onCerrar }: ModalGastoProps) {
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
    if (!descripcion.trim()) {
      setError('Ingresa una descripción para el gasto.');
      return;
    }
    onGuardar(valor, descripcion.trim(), categoriaId);
    onCerrar();
  };

  return (
    <Modal titulo="Agregar gasto" onCerrar={onCerrar}>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Ej. Supermercado"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
        >
          Guardar gasto
        </button>
      </form>
    </Modal>
  );
}
