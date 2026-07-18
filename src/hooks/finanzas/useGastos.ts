import { useCallback } from 'react';
import type { Gasto } from '../../types/finanzas';
import { crearId } from './helpers';
import type { Persistir } from './types';

export function useGastos(claveMes: string, persistir: Persistir) {
  const agregarGasto = useCallback((monto: number, descripcion: string, categoriaId: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      const nuevoGasto: Gasto = {
        id: crearId(),
        monto,
        descripcion,
        categoriaId,
        fecha: new Date().toISOString(),
        esFijo: false,
      };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: [...mes.gastos, nuevoGasto] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarGasto = useCallback((id: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: mes.gastos.filter((g) => g.id !== id) },
        },
      };
    });
  }, [claveMes, persistir]);

  return { agregarGasto, eliminarGasto };
}
