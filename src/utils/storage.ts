import type { FinanzasData } from '../types/finanzas';

const STORAGE_KEY = 'finanzas-app-data';

export function cargarDatos(): FinanzasData {
  const crudo = localStorage.getItem(STORAGE_KEY);
  if (!crudo) {
    return { categorias: [], gastosFijos: [], meses: {} };
  }
  try {
    const parsed = JSON.parse(crudo);
    return {
      categorias: parsed.categorias ?? [],
      gastosFijos: parsed.gastosFijos ?? [],
      meses: parsed.meses ?? {},
    };
  } catch {
    return { categorias: [], gastosFijos: [], meses: {} };
  }
}

export function guardarDatos(data: FinanzasData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
