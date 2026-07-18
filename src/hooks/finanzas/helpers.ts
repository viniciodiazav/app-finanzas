import type { DatosMes } from '../../types/finanzas';
import { montoDePresupuesto } from '../../utils/presupuesto';

export function crearId(): string {
  return crypto.randomUUID();
}

export function crearMesVacio(clave: string): DatosMes {
  return {
    clave,
    ingresoFijo: 0,
    presupuestos: [],
    ahorro: null,
    ingresosExtra: [],
    gastos: [],
  };
}

export function montoAhorroDe(mes: DatosMes): number {
  return mes.ahorro ? montoDePresupuesto(mes.ahorro, mes.ingresoFijo) : 0;
}

export function totalMontoPresupuestos(mes: DatosMes): number {
  return mes.presupuestos.reduce((acc, p) => acc + montoDePresupuesto(p, mes.ingresoFijo), 0);
}
