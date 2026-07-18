import { useState } from 'react';
import { Modal } from './Modal';
import type { AhorroDetalle, ModoPresupuesto } from '../types/finanzas';
import { formatoMoneda } from '../utils/formato';

interface ModalAhorroProps {
  ahorroExistente: AhorroDetalle | null;
  ingresoFijo: number;
  disponibleParaPresupuestar: number;
  onGuardar: (modo: ModoPresupuesto, valor: number) => { ok: boolean; error?: string };
  onCerrar: () => void;
}

export function ModalAhorro({
  ahorroExistente,
  ingresoFijo,
  disponibleParaPresupuestar,
  onGuardar,
  onCerrar,
}: ModalAhorroProps) {
  const [modo, setModo] = useState<ModoPresupuesto>(ahorroExistente?.modo ?? 'monto');
  const [valor, setValor] = useState(ahorroExistente ? String(ahorroExistente.valor) : '');
  const [error, setError] = useState('');

  const valorNumerico = Number(valor);
  const montoEquivalente = modo === 'porcentaje' && !isNaN(valorNumerico)
    ? (ingresoFijo * valorNumerico) / 100
    : null;
  const porcentajeEquivalente = modo === 'monto' && !isNaN(valorNumerico) && ingresoFijo > 0
    ? (valorNumerico / ingresoFijo) * 100
    : null;

  const disponibleParaEste = ahorroExistente
    ? disponibleParaPresupuestar + ahorroExistente.monto
    : disponibleParaPresupuestar;

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
    const resultado = onGuardar(modo, valorNumerico);
    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo guardar el ahorro.');
      return;
    }
    onCerrar();
  };

  return (
    <Modal titulo={ahorroExistente ? 'Editar ahorro mensual' : 'Definir ahorro mensual'} onCerrar={onCerrar}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModo('monto')}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg border ${
              modo === 'monto'
                ? 'bg-pink-600 text-white border-pink-600'
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
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Porcentaje
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            {modo === 'monto' ? 'Monto de ahorro' : 'Porcentaje del ingreso fijo'}
          </label>
          <input
            type="number"
            step="0.01"
            autoFocus
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder={modo === 'monto' ? '0.00' : '0'}
          />
          {montoEquivalente !== null && (
            <p className="text-xs text-slate-500 mt-1">Equivale aprox. a {formatoMoneda(montoEquivalente)}</p>
          )}
          {porcentajeEquivalente !== null && (
            <p className="text-xs text-slate-500 mt-1">Equivale aprox. a {porcentajeEquivalente.toFixed(1)}% del ingreso fijo</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Disponible para presupuestar/ahorrar: {formatoMoneda(disponibleParaEste)}
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700"
        >
          Guardar
        </button>
      </form>
    </Modal>
  );
}
