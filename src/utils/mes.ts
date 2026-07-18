const MESES_NOMBRE = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function claveMesDeFecha(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function claveMesActual(): string {
  return claveMesDeFecha(new Date());
}

export function partesClave(clave: string): { year: number; month: number } {
  const [year, month] = clave.split('-').map(Number);
  return { year, month };
}

export function sumarMeses(clave: string, delta: number): string {
  const { year, month } = partesClave(clave);
  const total = year * 12 + (month - 1) + delta;
  const nuevoYear = Math.floor(total / 12);
  const nuevoMes = (total % 12) + 1;
  return `${nuevoYear}-${String(nuevoMes).padStart(2, '0')}`;
}

export function etiquetaMes(clave: string): string {
  const { year, month } = partesClave(clave);
  return `${MESES_NOMBRE[month - 1]} ${year}`;
}

export function esMesFuturo(clave: string): boolean {
  return clave > claveMesActual();
}

export type EstadoTemporalMes = 'pasado' | 'actual' | 'futuro';

export function estadoTemporalMes(clave: string): EstadoTemporalMes {
  const actual = claveMesActual();
  if (clave < actual) return 'pasado';
  if (clave > actual) return 'futuro';
  return 'actual';
}
