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
 */
export function crearHarnessFinanzas(RouteComponent: (props: ConFinanzas) => ReactElement) {
  return function Harness() {
    const finanzas = useFinanzas();
    return <RouteComponent finanzas={finanzas} />;
  };
}
