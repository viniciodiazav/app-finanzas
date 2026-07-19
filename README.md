# Mis Finanzas

App de finanzas personales para llevar el control del ingreso fijo, presupuestos por categoría, ahorro, gastos e ingresos extra de cada mes. Los datos se guardan en `localStorage` del navegador; no requiere backend ni cuenta.

## Funcionalidades

- **Ingreso fijo mensual**: se define una sola vez por mes y no puede modificarse después.
- **Presupuestos por categoría**: por monto fijo o por porcentaje del ingreso fijo, con validación para que la suma de presupuestos + ahorro no exceda el ingreso fijo.
- **Ahorro mensual**: mismo esquema monto/porcentaje que los presupuestos, compitiendo por el mismo disponible.
- **Gastos y gastos fijos**: los gastos fijos (renta, suscripciones, etc.) se regeneran automáticamente cada mes mientras estén vigentes y dejan de generarse al vencer su duración.
- **Categorías**: crear, renombrar y eliminar categorías. No se puede eliminar una categoría con presupuestos o gastos asociados (histórico o vigente).
- **Estadísticas, reporte mensual e historial**: vistas derivadas del mes actual (o de meses anteriores, navegando con las flechas del encabezado).
- **Respaldo**: exportar/importar todos los datos como JSON.

## Desarrollo

```bash
npm install
npm run dev       # servidor de desarrollo
npm run test      # corre la suite de vitest
npm run lint      # oxlint
npm run build     # typecheck (tsc -b) + build de producción
```

## Estructura

- `src/hooks/finanzas/`: un hook por responsabilidad (persistencia, navegación de mes, ingreso fijo, presupuestos, ahorro, ingresos extra, categorías, gastos, gastos fijos, derivados). `src/hooks/useFinanzas.ts` los compone y expone una sola API a las rutas.
- `src/routes/`: una ruta por pantalla, encargada de conectar `useFinanzas` con el componente de presentación correspondiente en `src/components/`.
- `src/utils/`: funciones puras (fechas, cálculo de montos de presupuesto, formato de moneda, backup) — es donde vive la mayoría de los tests de lógica.
- `src/types/finanzas.ts`: modelo de datos central (`FinanzasData`, `DatosMes`, etc.).

## Pendiente / roadmap

- Soporte para tarjetas de crédito y sus fechas de corte/pago (requiere un ciclo independiente del mes calendario que usa el resto de la app).
- Sincronización remota (hoy todo vive en `localStorage`, un solo dispositivo).
