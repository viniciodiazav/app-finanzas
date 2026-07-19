import type { FinanzasData } from '../types/finanzas';

const STORAGE_KEY = 'finanzas-app-data';

function datosVacios(): FinanzasData {
  return { categorias: [], gastosFijos: [], meses: {} };
}

function parsear(crudo: string | null): FinanzasData {
  if (!crudo) return datosVacios();
  try {
    const parsed = JSON.parse(crudo);
    return {
      categorias: parsed.categorias ?? [],
      gastosFijos: parsed.gastosFijos ?? [],
      meses: parsed.meses ?? {},
    };
  } catch {
    return datosVacios();
  }
}

export function cargarDatos(): FinanzasData {
  return parsear(localStorage.getItem(STORAGE_KEY));
}

export function guardarDatos(data: FinanzasData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function claveUsuario(userId: string): string {
  return `${STORAGE_KEY}:${userId}`;
}

export function cargarDatosUsuario(userId: string): FinanzasData {
  return parsear(localStorage.getItem(claveUsuario(userId)));
}

export function guardarDatosUsuario(userId: string, data: FinanzasData): void {
  localStorage.setItem(claveUsuario(userId), JSON.stringify(data));
}

export function limpiarDatosSinCuenta(): void {
  localStorage.removeItem(STORAGE_KEY);
}
