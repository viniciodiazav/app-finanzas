import { useMemo } from 'react';
import type { AhorroDetalle, Categoria, DatosMes, PresupuestoDetalle } from '../../types/finanzas';
import { montoDePresupuesto, porcentajeDePresupuesto } from '../../utils/presupuesto';

export function useFinanzasDerivados(mesActual: DatosMes, categorias: Categoria[]) {
  const totalIngresosExtra = useMemo(
    () => mesActual.ingresosExtra.reduce((acc, i) => acc + i.monto, 0),
    [mesActual.ingresosExtra]
  );

  const totalGastos = useMemo(
    () => mesActual.gastos.reduce((acc, g) => acc + g.monto, 0),
    [mesActual.gastos]
  );

  const ingresoTotal = mesActual.ingresoFijo + totalIngresosExtra;

  const presupuestosDetalle: PresupuestoDetalle[] = useMemo(() => {
    return mesActual.presupuestos.map((p) => {
      const nombreCategoria = categorias.find((c) => c.id === p.categoriaId)?.nombre ?? 'Sin categoría';
      const monto = montoDePresupuesto(p, mesActual.ingresoFijo);
      const porcentaje = porcentajeDePresupuesto(p, mesActual.ingresoFijo);
      const gastado = mesActual.gastos
        .filter((g) => g.categoriaId === p.categoriaId)
        .reduce((acc, g) => acc + g.monto, 0);
      const restante = monto - gastado;
      return {
        ...p,
        nombreCategoria,
        monto,
        porcentaje,
        gastado,
        restante,
        sobregasto: restante < 0,
      };
    });
  }, [mesActual.presupuestos, mesActual.gastos, mesActual.ingresoFijo, categorias]);

  const totalPresupuestado = useMemo(
    () => presupuestosDetalle.reduce((acc, p) => acc + p.monto, 0),
    [presupuestosDetalle]
  );

  const ahorroDetalle: AhorroDetalle | null = useMemo(() => {
    if (!mesActual.ahorro) return null;
    return {
      ...mesActual.ahorro,
      monto: montoDePresupuesto(mesActual.ahorro, mesActual.ingresoFijo),
      porcentaje: porcentajeDePresupuesto(mesActual.ahorro, mesActual.ingresoFijo),
    };
  }, [mesActual.ahorro, mesActual.ingresoFijo]);

  const montoAhorro = ahorroDetalle?.monto ?? 0;

  const disponibleParaPresupuestar = Math.max(mesActual.ingresoFijo - totalPresupuestado - montoAhorro, 0);

  return {
    totalIngresosExtra,
    totalGastos,
    ingresoTotal,
    presupuestosDetalle,
    totalPresupuestado,
    ahorroDetalle,
    montoAhorro,
    disponibleParaPresupuestar,
  };
}
