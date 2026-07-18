export interface Categoria {
  id: string;
  nombre: string;
}

export interface IngresoExtra {
  id: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export interface Gasto {
  id: string;
  monto: number;
  descripcion: string;
  categoriaId: string;
  fecha: string;
  esFijo: boolean;
  gastoFijoId?: string;
}

export interface GastoFijo {
  id: string;
  monto: number;
  descripcion: string;
  categoriaId: string;
  mesInicio: string;
  duracionMeses: number | null; // null = indefinido
}

export type ModoPresupuesto = 'monto' | 'porcentaje';

export interface PresupuestoCategoria {
  id: string;
  categoriaId: string;
  modo: ModoPresupuesto;
  valor: number; // monto en dinero si modo="monto", 0-100 si modo="porcentaje" (del ingreso fijo)
}

export interface Ahorro {
  modo: ModoPresupuesto;
  valor: number; // monto en dinero si modo="monto", 0-100 si modo="porcentaje" (del ingreso fijo)
}

export interface DatosMes {
  clave: string; // "YYYY-MM"
  ingresoFijo: number;
  presupuestos: PresupuestoCategoria[];
  ahorro: Ahorro | null;
  ingresosExtra: IngresoExtra[];
  gastos: Gasto[];
}

export interface PresupuestoDetalle extends PresupuestoCategoria {
  nombreCategoria: string;
  monto: number;
  porcentaje: number;
  gastado: number;
  restante: number;
  sobregasto: boolean;
}

export interface AhorroDetalle extends Ahorro {
  monto: number;
  porcentaje: number;
}

export interface FinanzasData {
  categorias: Categoria[];
  gastosFijos: GastoFijo[];
  meses: Record<string, DatosMes>;
}
