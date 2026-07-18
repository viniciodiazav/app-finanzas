import { useCallback } from 'react';
import type { Gasto } from '../../types/finanzas';
import { crearId } from './helpers';
import type { Persistir } from './types';

export function useGastosFijos(claveMes: string, persistir: Persistir) {
  const agregarGastoFijo = useCallback((
    monto: number,
    descripcion: string,
    categoriaId: string,
    duracionMeses: number | null
  ) => {
    persistir((prev) => {
      const gastoFijoId = crearId();
      const nuevoGastoFijo = {
        id: gastoFijoId,
        monto,
        descripcion,
        categoriaId,
        mesInicio: claveMes,
        duracionMeses,
      };
      const mes = prev.meses[claveMes];
      const gastoGenerado: Gasto = {
        id: crearId(),
        monto,
        descripcion,
        categoriaId,
        fecha: new Date().toISOString(),
        esFijo: true,
        gastoFijoId,
      };
      return {
        ...prev,
        gastosFijos: [...prev.gastosFijos, nuevoGastoFijo],
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: [...mes.gastos, gastoGenerado] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarGastoFijo = useCallback((gastoFijoId: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        gastosFijos: prev.gastosFijos.filter((gf) => gf.id !== gastoFijoId),
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mes,
            gastos: mes.gastos.filter((g) => g.gastoFijoId !== gastoFijoId),
          },
        },
      };
    });
  }, [claveMes, persistir]);

  return { agregarGastoFijo, eliminarGastoFijo };
}
