# Mis Finanzas

App de finanzas personales multi-usuario (varias personas, cada una con su propia cuenta de usuario + contraseña). React 19 + TypeScript + Vite + Tailwind 4, con Supabase como backend (auth + persistencia). Desplegada en Netlify. Repo: `viniciodiazav/app-finanzas` en GitHub.

## Qué hace

Ingreso fijo mensual (se define una sola vez por mes, inmutable), presupuestos por categoría (monto o % del ingreso fijo), ahorro mensual (mismo esquema, compite por el mismo disponible), gastos e ingresos extra, gastos fijos que se regeneran solos cada mes mientras estén vigentes, gestión de categorías (crear/renombrar/eliminar con bloqueo si están en uso), estadísticas, reporte mensual, historial, y respaldo manual (exportar/importar JSON).

## Arquitectura

- `src/hooks/finanzas/`: un hook por responsabilidad (persistencia, navegación de mes, ingreso fijo, presupuestos, ahorro, ingresos extra, categorías, gastos, gastos fijos, derivados). `src/hooks/useFinanzas.ts` los compone y expone una sola API (`UseFinanzasReturn`) que se pasa por props a todas las rutas — no hay Context, todo es prop-drilling deliberado.
- `src/routes/`: una ruta por pantalla, conecta `useFinanzas` con el componente de presentación en `src/components/`.
- `src/types/finanzas.ts`: modelo de datos central. Todo el estado de la app es un solo objeto `FinanzasData` serializable (`{ categorias, gastosFijos, meses }`), lo que hizo trivial guardarlo completo como una sola columna `jsonb` en vez de normalizar tablas.
- `src/utils/`: funciones puras (fechas, cálculo de montos de presupuesto, formato de moneda, backup). Ahí vive la mayoría de los tests de lógica.

## Autenticación y persistencia (Supabase)

- `src/lib/supabaseClient.ts`: cliente único. Usa `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` con fallback a placeholders si faltan, **a propósito**, para que importar el módulo no truene en tests o en dev sin `.env.local` — solo falla si de verdad se intenta usar sin credenciales reales.
- **Login es usuario + contraseña, no correo real**: Supabase Auth solo tiene identidades por correo, así que `src/hooks/useAuth.ts` convierte cada nombre de usuario en un correo sintético bajo un dominio ficticio (`usuario@misfinanzas.local`, ver `usernameAEmail` en ese archivo) y lo usa para `signInWithPassword`/`signUp`. Esto también da gratis la validación de usuario duplicado (Supabase ya rechaza correos repetidos). `LoginScreen.tsx` valida el formato del usuario (`/^[a-z0-9_]{3,20}$/i`) antes de enviarlo. **No hay recuperación de contraseña por correo** (no existe un correo real que reciba nada) — si alguien la olvida, hay que resetearla a mano desde el SQL Editor de Supabase.
- **En el dashboard de Supabase, "Confirm email" debe estar desactivado** (Authentication → Settings) — los correos sintéticos no existen de verdad y no pueden recibir confirmación. Por la misma razón, ya no se necesita SMTP personalizado (Resend) para esta app; se puede dejar el SMTP por defecto de Supabase sin que importe, porque nunca se envían correos.
- `src/hooks/useAuth.ts` + `src/components/LoginScreen.tsx` + `src/components/AuthGate.tsx`: sesión, login/signup por usuario y contraseña. `AuthGate` envuelve `<App userId={...} onCerrarSesion={...}>` en `main.tsx` (dentro de `ErrorBoundary` y `BrowserRouter`).
- `src/hooks/finanzas/usePersistencia.ts`: con `userId === null` (como en **todos** los tests, que llaman `useFinanzas()` sin argumento) es 100% local, idéntico a como era antes de que existiera Supabase — no toca red. Con `userId` real: al montar trae la fila remota (`select ... maybeSingle()`); si no existe, siembra Supabase con lo que hubiera en la llave de `localStorage` **sin dueño** (`finanzas-app-data`, la de antes del login) y la consume (borra) para que no se filtre a otra cuenta. Cada `persistir()` escribe a `localStorage` de forma síncrona y dispara un `upsert` remoto fire-and-forget.
- **Cada usuario autenticado tiene su propia llave de caché**: `finanzas-app-data:<userId>` (ver `src/utils/storage.ts`). La llave sin sufijo solo se usa en modo local puro y como semilla de migración de una sola vez. Esto se agregó después de un bug real: todas las cuentas en el mismo navegador compartían la llave, así que una cuenta nueva heredaba los datos de la última cuenta usada.
- Tabla en Supabase: `public.finanzas(user_id uuid primary key references auth.users(id) on delete cascade, data jsonb, updated_at timestamptz)`, con RLS (`auth.uid() = user_id` en select/insert/update). El SQL completo está en el historial de esta conversación si hay que recrearlo.
- **Bug ya corregido, no reintroducir**: `useMesNavegacion` tiene un efecto que crea el mes actual si falta en `data`. Ese efecto NO debe correr mientras `usePersistencia` sigue cargando la fila remota (`cargando === true`), porque vería el `data` local (posiblemente vacío) antes de que llegue lo remoto y lo sobreescribiría con un mes vacío. Por eso `useMesNavegacion(data, persistir, cargando)` recibe `cargando` y lo usa como guard. `App.tsx` también muestra una pantalla de "Cargando tus datos..." mientras `finanzas.cargando` es true.

## Supabase — configuración del proyecto (dashboard, no código)

- Auth por usuario/contraseña (vía correos sintéticos, ver arriba), con **`Confirm email` desactivado** en Authentication → Settings.
- No hace falta SMTP personalizado (se probó con Resend, pero se abandonó: su dominio sandbox `onboarding@resend.dev` solo entrega al correo dueño de la cuenta Resend, y verificar un dominio propio requiere tener uno comprado, cosa que este proyecto decidió no requerir).
- `.env.local` (no está en git, cubierto por el patrón `*.local` en `.gitignore`) tiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Si se clona el repo en otra máquina, hay que recrearlo a mano con esos mismos valores.

## Deploy (Netlify)

- `public/_redirects` con `/* /index.html 200` — necesario porque el ruteo es client-side (`BrowserRouter`); sin esto, recargar en cualquier ruta que no sea `/` da 404.
- Variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) configuradas en el dashboard de Netlify — se hornean en el build, así que cambiarlas requiere un nuevo deploy.

## Testing

- Vitest + React Testing Library. `src/test/setup.ts` importa `@testing-library/jest-dom/vitest` y registra `cleanup()` en `afterEach` (necesario, no viene solo).
- Cobertura de UI completa: cada componente, modal, pantalla y ruta tiene su propio `*.test.tsx`. Las rutas se prueban con `src/test/crearHarnessFinanzas.tsx`, un helper que reproduce cómo `App.tsx` conecta `useFinanzas()` real (no mockeado) con cada ruta, sembrando `localStorage` antes de renderizar.
- Para tests que mockean Supabase (`usePersistencia.test.ts`, `useAuth.test.ts`), usar `vi.hoisted()` para declarar los mocks antes de `vi.mock(...)` — evita problemas de hoisting.
- `npm run test`, `npm run lint` (oxlint), `npm run build` (tsc -b + vite build) deben quedar limpios antes de dar por terminado cualquier cambio.

## Pendiente / roadmap

- **Tarjetas de crédito y fechas de corte**: el próximo feature grande. Ojo: el modelo actual organiza todo por mes calendario (`claveMes = "YYYY-MM"`); un corte de tarjeta casi nunca coincide con eso, así que va a necesitar un ciclo independiente del mes calendario, no solo "otro gasto fijo".
- Moneda/locale hardcodeado a `es-MX`/MXN (`src/utils/formato.ts`) — no configurable, a propósito por ahora.
- Sin CI (no hay GitHub Actions corriendo lint/tests/build en cada push).
- Sin manifest/PWA (no instalable, aunque funciona offline por depender de `localStorage` como caché).
