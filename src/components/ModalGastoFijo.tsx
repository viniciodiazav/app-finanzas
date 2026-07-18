import { useState } from 'react';
import { Modal } from './Modal';
import { SelectorCategoria } from './SelectorCategoria';
import type { Categoria } from '../types/finanzas';

interface ModalGastoFijoProps {
  categorias: Categoria[];
  onGuardar: (monto: number, descripcion: string, categoriaId: string, duracionMeses: number | null) => void;
  onCerrar: () => void;
}

export function ModalGastoFijo({ categorias, onGuardar, onCerrar }: ModalGastoFijoProps) {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [indefinido, setIndefinido] = useState(true);
  const [duracion, setDuracion] = useState('3');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(monto);
    if (!monto || isNaN(valor) || valor <= 0) {
      setError('Ingresa un monto válido mayor a 0.');
      return;
    }
    if (!descripcion.trim()) {
      setError('Ingresa una descripción para el gasto fijo.');
      return;
    }
    if (!categoriaId) {
      setError('Selecciona una categoría.');
      return;
    }
    let duracionMeses: number | null = null;
    if (!indefinido) {
      const valorDuracion = Number(duracion);
      if (!duracion || isNaN(valorDuracion) || valorDuracion <= 0) {
        setError('Ingresa una duración válida en meses.');
        return;
      }
      duracionMeses = valorDuracion;
    }
    onGuardar(valor, descripcion.trim(), categoriaId, duracionMeses);
    onCerrar();
  };

  return (
    <Modal titulo="Agregar gasto fijo" onCerrar={onCerrar}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Ej. Renta, Netflix, gimnasio"
          />
        </div>
        <SelectorCategoria
          categorias={categorias}
          categoriaId={categoriaId}
          onCambiarCategoriaId={setCategoriaId}
          permitirCrear={false}
          mensajeVacio="Primero define un presupuesto por categoría antes de agregar un gasto fijo."
        />
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Duración</label>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-1.5 text-sm text-slate-600">
              <input
                type="radio"
                checked={indefinido}
                onChange={() => setIndefinido(true)}
              />
              Indefinido
            </label>
            <label className="flex items-center gap-1.5 text-sm text-slate-600">
              <input
                type="radio"
                checked={!indefinido}
                onChange={() => setIndefinido(false)}
              />
              Por un periodo
            </label>
          </div>
          {!indefinido && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-500">meses</span>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-accent-600 text-white font-semibold hover:bg-accent-700"
        >
          Guardar gasto fijo
        </button>
      </form>
    </Modal>
  );
}
