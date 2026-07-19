import { useCallback, useEffect, useState } from 'react';
import type { FinanzasData } from '../../types/finanzas';
import { cargarDatos, cargarDatosUsuario, guardarDatos, guardarDatosUsuario, limpiarDatosSinCuenta } from '../../utils/storage';
import { supabase } from '../../lib/supabaseClient';

function tieneDatos(data: FinanzasData): boolean {
  return data.categorias.length > 0 || data.gastosFijos.length > 0 || Object.keys(data.meses).length > 0;
}

export function usePersistencia(userId: string | null = null) {
  const [data, setData] = useState<FinanzasData>(() => (userId ? cargarDatosUsuario(userId) : cargarDatos()));
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
          guardarDatosUsuario(userId, remoto);
        } else {
          // Primera vez que este usuario sincroniza. Si este navegador tenía datos
          // de antes de que existiera el login (sin ligar a ningún usuario todavía),
          // los adopta como semilla y los borra de esa llave sin dueño, para que no
          // se filtren a otra cuenta que inicie sesión después en el mismo navegador.
          const previosSinCuenta = cargarDatos();
          const datosSemilla = tieneDatos(previosSinCuenta) ? previosSinCuenta : cargarDatosUsuario(userId);
          if (tieneDatos(previosSinCuenta)) limpiarDatosSinCuenta();

          const { error: errorUpsert } = await supabase
            .from('finanzas')
            .upsert({ user_id: userId, data: datosSemilla });
          if (errorUpsert) console.error('No se pudo sembrar los datos remotos:', errorUpsert);

          guardarDatosUsuario(userId, datosSemilla);
          setData(datosSemilla);
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

      if (userId) {
        guardarDatosUsuario(userId, nuevo);
        supabase
          .from('finanzas')
          .upsert({ user_id: userId, data: nuevo, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error('No se pudo sincronizar con Supabase:', error);
          });
      } else {
        guardarDatos(nuevo);
      }

      return nuevo;
    });
  }, [userId]);

  const restaurarDatos = useCallback((nuevaData: FinanzasData) => {
    persistir(() => nuevaData);
  }, [persistir]);

  return { data, persistir, restaurarDatos, cargando };
}
