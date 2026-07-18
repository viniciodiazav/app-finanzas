import { useCallback, useEffect, useState } from 'react';
import type { DatosMes, FinanzasData, Gasto } from '../../types/finanzas';
import { claveMesActual, sumarMeses } from '../../utils/mes';
import { esGastoFijoActivoEnMes, estaVencido } from '../../utils/gastosFijos';
import { crearId, crearMesVacio } from './helpers';
import type { Persistir } from './types';

export function useMesNavegacion(data: FinanzasData, persistir: Persistir) {
  const [claveMes, setClaveMes] = useState<string>(() => claveMesActual());

  const asegurarMes = useCallback((clave: string) => {
    persistir((prev) => {
      if (prev.meses[clave]) return prev;

      const nuevoMes = crearMesVacio(clave);

      const gastosFijosActivos = prev.gastosFijos.filter((gf) =>
        esGastoFijoActivoEnMes(gf, clave)
      );
      const gastosGenerados: Gasto[] = gastosFijosActivos.map((gf) => ({
        id: crearId(),
        monto: gf.monto,
        descripcion: gf.descripcion,
        categoriaId: gf.categoriaId,
        fecha: new Date().toISOString(),
        esFijo: true,
        gastoFijoId: gf.id,
      }));
      nuevoMes.gastos = gastosGenerados;

      const gastosFijosVigentes = prev.gastosFijos.filter(
        (gf) => !estaVencido(gf, clave)
      );

      return {
        ...prev,
        gastosFijos: gastosFijosVigentes,
        meses: { ...prev.meses, [clave]: nuevoMes },
      };
    });
  }, [persistir]);

  const irAMes = useCallback((clave: string) => {
    setClaveMes(clave);
    asegurarMes(clave);
  }, [asegurarMes]);

  const mesAnterior = useCallback(() => {
    irAMes(sumarMeses(claveMes, -1));
  }, [claveMes, irAMes]);

  const mesSiguiente = useCallback(() => {
    irAMes(sumarMeses(claveMes, 1));
  }, [claveMes, irAMes]);

  useEffect(() => {
    if (!data.meses[claveMes]) {
      asegurarMes(claveMes);
    }
  }, [claveMes, data.meses, asegurarMes]);

  const mesActual: DatosMes = data.meses[claveMes] ?? crearMesVacio(claveMes);

  return { claveMes, mesActual, irAMes, mesAnterior, mesSiguiente };
}
