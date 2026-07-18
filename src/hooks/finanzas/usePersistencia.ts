import { useCallback, useState } from 'react';
import type { FinanzasData } from '../../types/finanzas';
import { cargarDatos, guardarDatos } from '../../utils/storage';

export function usePersistencia() {
  const [data, setData] = useState<FinanzasData>(() => cargarDatos());

  const persistir = useCallback((actualizar: (prev: FinanzasData) => FinanzasData) => {
    setData((prev) => {
      const nuevo = actualizar(prev);
      guardarDatos(nuevo);
      return nuevo;
    });
  }, []);

  const restaurarDatos = useCallback((nuevaData: FinanzasData) => {
    persistir(() => nuevaData);
  }, [persistir]);

  return { data, persistir, restaurarDatos };
}
