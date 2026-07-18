import type { ModoPresupuesto } from '../types/finanzas';

interface ValorPresupuesto {
  modo: ModoPresupuesto;
  valor: number;
}

export function montoDePresupuesto(presupuesto: ValorPresupuesto, ingresoFijo: number): number {
  if (presupuesto.modo === 'monto') return presupuesto.valor;
  return (ingresoFijo * presupuesto.valor) / 100;
}

export function porcentajeDePresupuesto(presupuesto: ValorPresupuesto, ingresoFijo: number): number {
  if (presupuesto.modo === 'porcentaje') return presupuesto.valor;
  if (ingresoFijo <= 0) return 0;
  return (presupuesto.valor / ingresoFijo) * 100;
}
