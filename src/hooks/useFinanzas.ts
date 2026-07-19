import { usePersistencia } from './finanzas/usePersistencia';
import { useMesNavegacion } from './finanzas/useMesNavegacion';
import { useIngresoFijo } from './finanzas/useIngresoFijo';
import { usePresupuestos } from './finanzas/usePresupuestos';
import { useAhorro } from './finanzas/useAhorro';
import { useIngresosExtra } from './finanzas/useIngresosExtra';
import { useCategorias } from './finanzas/useCategorias';
import { useGastos } from './finanzas/useGastos';
import { useGastosFijos } from './finanzas/useGastosFijos';
import { useFinanzasDerivados } from './finanzas/useFinanzasDerivados';

export function useFinanzas(userId: string | null = null) {
  const { data, persistir, restaurarDatos, cargando } = usePersistencia(userId);
  const { claveMes, mesActual, irAMes, mesAnterior, mesSiguiente } = useMesNavegacion(data, persistir, cargando);
  const { definirIngresoFijo } = useIngresoFijo(claveMes, mesActual, persistir);
  const { agregarPresupuestoCategoria, editarPresupuestoCategoria, eliminarPresupuestoCategoria } =
    usePresupuestos(claveMes, data, persistir);
  const { definirAhorro, eliminarAhorro } = useAhorro(claveMes, data, persistir);
  const { agregarIngresoExtra, eliminarIngresoExtra } = useIngresosExtra(claveMes, persistir);
  const { agregarCategoria, editarCategoria, eliminarCategoria, categoriasConUso } = useCategorias(data, persistir);
  const { agregarGasto, eliminarGasto } = useGastos(claveMes, persistir);
  const { agregarGastoFijo, eliminarGastoFijo } = useGastosFijos(claveMes, persistir);
  const derivados = useFinanzasDerivados(mesActual, data.categorias);

  return {
    data,
    claveMes,
    mesActual,
    categorias: data.categorias,
    gastosFijos: data.gastosFijos,
    irAMes,
    mesAnterior,
    mesSiguiente,
    definirIngresoFijo,
    agregarPresupuestoCategoria,
    editarPresupuestoCategoria,
    eliminarPresupuestoCategoria,
    definirAhorro,
    eliminarAhorro,
    agregarIngresoExtra,
    eliminarIngresoExtra,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    categoriasConUso,
    agregarGasto,
    eliminarGasto,
    agregarGastoFijo,
    eliminarGastoFijo,
    restaurarDatos,
    cargando,
    ...derivados,
  };
}

export type UseFinanzasReturn = ReturnType<typeof useFinanzas>;
