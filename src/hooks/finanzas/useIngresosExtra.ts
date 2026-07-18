import { useCallback } from 'react';
import { crearId } from './helpers';
import type { Persistir } from './types';

export function useIngresosExtra(claveMes: string, persistir: Persistir) {
  const agregarIngresoExtra = useCallback((monto: number, descripcion: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      const nuevoIngreso = {
        id: crearId(),
        monto,
        descripcion,
        fecha: new Date().toISOString(),
      };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, ingresosExtra: [...mes.ingresosExtra, nuevoIngreso] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarIngresoExtra = useCallback((id: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mes,
            ingresosExtra: mes.ingresosExtra.filter((i) => i.id !== id),
          },
        },
      };
    });
  }, [claveMes, persistir]);

  return { agregarIngresoExtra, eliminarIngresoExtra };
}
