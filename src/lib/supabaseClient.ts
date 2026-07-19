import { createClient } from '@supabase/supabase-js';

// Si faltan las variables de entorno (p. ej. en tests, o antes de configurar el
// proyecto de Supabase), se usa un placeholder para que crear el cliente no truene
// en cada import. Solo falla si de verdad se intenta usar sin credenciales reales.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);
