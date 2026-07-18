import { useState } from 'react';
import { Modal } from './Modal';
import type { Categoria, ModoPresupuesto, PresupuestoDetalle } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';

interface ModalPresupuestoCategoriaProps {
  presupuestoExistente?: PresupuestoDetalle;
  categorias: Categoria[];
  ingresoFijo: number;
  disponibleParaPresupuestar: number;
  onCrearCategoria: (nombre: string) => { ok: boolean; error?: string; id?: string };
  onGuardarNuevo: (categoriaId: string, modo: ModoPresupuesto, valor: number) => { ok: boolean; error?: string };
  onGuardarEdicion: (id: string, modo: ModoPresupuesto, valor: number) => { ok: boolean; error?: string };
  onCerrar: () => void;
}

export function ModalPresupuestoCategoria({
  presupuestoExistente,
  categorias,
  ingresoFijo,
  disponibleParaPresupuestar,
  onCrearCategoria,
  onGuardarNuevo,
  onGuardarEdicion,
  onCerrar,
}: ModalPresupuestoCategoriaProps) {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [modo, setModo] = useState<ModoPresupuesto>(presupuestoExistente?.modo ?? 'monto');
  const [valor, setValor] = useState(presupuestoExistente ? String(presupuestoExistente.valor) : '');
  const [error, setError] = useState('');

  const valorNumerico = Number(valor);
  const montoEquivalente = modo === 'porcentaje' && !isNaN(valorNumerico)
    ? (ingresoFijo * valorNumerico) / 100
    : null;
  const porcentajeEquivalente = modo === 'monto' && !isNaN(valorNumerico) && ingresoFijo > 0
    ? (valorNumerico / ingresoFijo) * 100
    : null;

  const disponibleParaEste = presupuestoExistente
    ? disponibleParaPresupuestar + presupuestoExistente.monto
    : disponibleParaPresupuestar;

  const resolverCategoriaId = (nombre: string): { ok: boolean; error?: string; id?: string } => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return { ok: false, error: 'Ingresa el nombre de la categoría.' };
    const existente = categorias.find((c) => c.nombre.toLowerCase() === nombreLimpio.toLowerCase());
    if (existente) return { ok: true, id: existente.id };
    return onCrearCategoria(nombreLimpio);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Ingresa un valor válido mayor a 0.');
      return;
    }
    if (modo === 'porcentaje' && valorNumerico > 100) {
      setError('El porcentaje no puede ser mayor a 100.');
      return;
    }

    let resultado: { ok: boolean; error?: string };
    if (presupuestoExistente) {
      resultado = onGuardarEdicion(presupuestoExistente.id, modo, valorNumerico);
    } else {
      const categoria = resolverCategoriaId(nombreCategoria);
      if (!categoria.ok || !categoria.id) {
        setError(categoria.error ?? 'No se pudo determinar la categoría.');
        return;
      }
      resultado = onGuardarNuevo(categoria.id, modo, valorNumerico);
    }

    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el presupuesto.');
      return;
    }
    onCerrar();
  };

  return (
    <Modal titulo={presupuestoExistente ? 'Editar presupuesto' : 'Nuevo presupuesto por categoría'} onCerrar={onCerrar}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
          {presupuestoExistente ? (
            <p className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
              {presupuestoExistente.nombreCategoria}
            </p>
          ) : (
            <input
              type="text"
              autoFocus
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              placeholder="Ej. Comida, Transporte..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModo('monto')}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg border ${
              modo === 'monto'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Monto
          </button>
          <button
            type="button"
            onClick={() => setModo('porcentaje')}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg border ${
              modo === 'porcentaje'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Porcentaje
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            {modo === 'monto' ? 'Monto de presupuesto' : 'Porcentaje del ingreso fijo'}
          </label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={modo === 'monto' ? '0.00' : '0'}
          />
          {montoEquivalente !== null && (
            <p className="text-xs text-slate-500 mt-1">Equivale aprox. a {formatoMoneda(montoEquivalente)}</p>
          )}
          {porcentajeEquivalente !== null && (
            <p className="text-xs text-slate-500 mt-1">Equivale aprox. a {porcentajeEquivalente.toFixed(1)}% del ingreso fijo</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Disponible para presupuestar: {formatoMoneda(disponibleParaEste)}
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
        >
          Guardar
        </button>
      </form>
    </Modal>
  );
}
