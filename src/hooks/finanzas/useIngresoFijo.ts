import { useCallback } from 'react';
import type { DatosMes } from '../../types/finanzas';
import { crearMesVacio } from './helpers';
import type { Persistir } from './types';

export function useIngresoFijo(claveMes: string, mesActual: DatosMes, persistir: Persistir) {
  const definirIngresoFijo = useCallback((monto: number): { ok: boolean; error?: string } => {
    if (mesActual.ingresoFijo > 0) {
      return { ok: false, error: 'El ingreso fijo de este mes ya fue definido y no se puede modificar.' };
    }
    persistir((prev) => ({
      ...prev,
      meses: {
        ...prev.meses,
        [claveMes]: { ...(prev.meses[claveMes] ?? crearMesVacio(claveMes)), ingresoFijo: monto },
      },
    }));
    return { ok: true };
  }, [claveMes, mesActual.ingresoFijo, persistir]);

  return { definirIngresoFijo };
}
