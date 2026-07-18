import { useCallback } from 'react';
import type { Ahorro, DatosMes, FinanzasData, ModoPresupuesto } from '../../types/finanzas';
import { montoDePresupuesto } from '../../utils/presupuesto';
import { crearMesVacio, totalMontoPresupuestos } from './helpers';
import type { Persistir } from './types';

export function useAhorro(claveMes: string, data: FinanzasData, persistir: Persistir) {
  const validarAhorro = useCallback((
    mes: DatosMes,
    modo: ModoPresupuesto,
    valor: number
  ): { ok: boolean; error?: string } => {
    if (mes.ingresoFijo <= 0) {
      return { ok: false, error: 'Primero define un ingreso fijo mensual mayor a 0.' };
    }
    const montoNuevo = montoDePresupuesto({ modo, valor }, mes.ingresoFijo);
    const montoOtros = totalMontoPresupuestos(mes);
    if (montoOtros + montoNuevo > mes.ingresoFijo + 0.01) {
      const disponible = Math.max(mes.ingresoFijo - montoOtros, 0);
      return {
        ok: false,
        error: `La suma de los presupuestos y el ahorro no puede superar el ingreso fijo mensual. Disponible: ${disponible.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.`,
      };
    }
    return { ok: true };
  }, []);

  const definirAhorro = useCallback((modo: ModoPresupuesto, valor: number): { ok: boolean; error?: string } => {
    const mes = data.meses[claveMes] ?? crearMesVacio(claveMes);
    const validacion = validarAhorro(mes, modo, valor);
    if (!validacion.ok) return validacion;

    persistir((prev) => {
      const mesActualPrev = prev.meses[claveMes] ?? crearMesVacio(claveMes);
      const nuevoAhorro: Ahorro = { modo, valor };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mesActualPrev, ahorro: nuevoAhorro },
        },
      };
    });
    return { ok: true };
  }, [claveMes, data.meses, persistir, validarAhorro]);

  const eliminarAhorro = useCallback(() => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, ahorro: null },
        },
      };
    });
  }, [claveMes, persistir]);

  return { definirAhorro, eliminarAhorro };
}
