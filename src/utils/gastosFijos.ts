import type { GastoFijo } from '../types/finanzas';
import { sumarMeses } from './mes';

export function claveFinGastoFijo(gastoFijo: GastoFijo): string | null {
  if (gastoFijo.duracionMeses === null) return null;
  return sumarMeses(gastoFijo.mesInicio, gastoFijo.duracionMeses);
}

export function esGastoFijoActivoEnMes(gastoFijo: GastoFijo, clave: string): boolean {
  if (clave < gastoFijo.mesInicio) return false;
  const claveFin = claveFinGastoFijo(gastoFijo);
  if (claveFin === null) return true;
  return clave < claveFin;
}

export function estaVencido(gastoFijo: GastoFijo, claveReferencia: string): boolean {
  const claveFin = claveFinGastoFijo(gastoFijo);
  if (claveFin === null) return false;
  return claveReferencia >= claveFin;
}
