import type { FinanzasData } from '../types/finanzas';

export function exportarDatos(data: FinanzasData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  const fecha = new Date().toISOString().slice(0, 10);
  enlace.href = url;
  enlace.download = `finanzas-backup-${fecha}.json`;
  enlace.click();
  URL.revokeObjectURL(url);
}

export function importarDatos(archivo: File): Promise<FinanzasData> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const parsed = JSON.parse(lector.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Formato inválido');
        }
        resolve({
          categorias: parsed.categorias ?? [],
          gastosFijos: parsed.gastosFijos ?? [],
          meses: parsed.meses ?? {},
        });
      } catch {
        reject(new Error('El archivo no tiene un formato JSON válido.'));
      }
    };
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    lector.readAsText(archivo);
  });
}
