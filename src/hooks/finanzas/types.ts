import type { FinanzasData } from '../../types/finanzas';

export type Persistir = (actualizar: (prev: FinanzasData) => FinanzasData) => void;
