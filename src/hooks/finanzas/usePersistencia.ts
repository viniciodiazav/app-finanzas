import { useCallback, useEffect, useState } from 'react';
import type { FinanzasData } from '../../types/finanzas';
import { cargarDatos, guardarDatos } from '../../utils/storage';
import { supabase } from '../../lib/supabaseClient';

export function usePersistencia(userId: string | null = null) {
  const [data, setData] = useState<FinanzasData>(() => cargarDatos());
  const [cargando, setCargando] = useState(userId !== null);

  useEffect(() => {
    if (!userId) {
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);

    supabase
      .from('finanzas')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()
      .then(async ({ data: fila, error }) => {
        if (cancelado) return;

        if (error) {
          console.error('No se pudieron cargar los datos remotos:', error);
          setCargando(false);
          return;
        }

        if (fila) {
          const remoto = fila.data as FinanzasData;
          setData(remoto);
          guardarDatos(remoto);
        } else {
          // Primera vez que este usuario sincroniza: adopta lo que ya hubiera en este navegador.
          const local = cargarDatos();
          const { error: errorUpsert } = await supabase
            .from('finanzas')
            .upsert({ user_id: userId, data: local });
          if (errorUpsert) console.error('No se pudo sembrar los datos remotos:', errorUpsert);
          setData(local);
        }

        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [userId]);

  const persistir = useCallback((actualizar: (prev: FinanzasData) => FinanzasData) => {
    setData((prev) => {
      const nuevo = actualizar(prev);
      guardarDatos(nuevo);
      if (userId) {
        supabase
          .from('finanzas')
          .upsert({ user_id: userId, data: nuevo, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error('No se pudo sincronizar con Supabase:', error);
          });
      }
      return nuevo;
    });
  }, [userId]);

  const restaurarDatos = useCallback((nuevaData: FinanzasData) => {
    persistir(() => nuevaData);
  }, [persistir]);

  return { data, persistir, restaurarDatos, cargando };
}
