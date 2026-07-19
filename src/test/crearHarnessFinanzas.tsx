import type { ReactElement } from 'react';
import { useFinanzas } from '../hooks/useFinanzas';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';

interface ConFinanzas {
  finanzas: UseFinanzasReturn;
}

/**
 * Los componentes de ruta reciben `finanzas` como prop en vez de llamar al hook
 * directamente (así lo hace App.tsx, para compartir una sola instancia entre rutas).
 * Este harness reproduce ese mismo cableado para poder probar la ruta contra un
 * `useFinanzas()` real en lugar de un mock, incluyendo re-renders cuando cambia el estado.
 *
 * `extraProps` cubre las props que la ruta necesita además de `finanzas` (por ejemplo,
 * `onCerrarSesion` en DashboardRoute).
 */
export function crearHarnessFinanzas<P extends ConFinanzas>(
  RouteComponent: (props: P) => ReactElement,
  extraProps?: Omit<P, 'finanzas'>
) {
  return function Harness() {
    const finanzas = useFinanzas();
    return <RouteComponent {...(extraProps as P)} finanzas={finanzas} />;
  };
}
