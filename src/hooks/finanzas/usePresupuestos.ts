import { useCallback } from 'react';
import type { DatosMes, FinanzasData, ModoPresupuesto, PresupuestoCategoria } from '../../types/finanzas';
import { montoDePresupuesto } from '../../utils/presupuesto';
import { crearId, crearMesVacio, montoAhorroDe } from './helpers';
import type { Persistir } from './types';

export function usePresupuestos(claveMes: string, data: FinanzasData, persistir: Persistir) {
  const validarPresupuesto = useCallback((
    mes: DatosMes,
    categoriaId: string,
    modo: ModoPresupuesto,
    valor: number,
    idAExcluir?: string
  ): { ok: boolean; error?: string } => {
    if (mes.ingresoFijo <= 0) {
      return { ok: false, error: 'Primero define un ingreso fijo mensual mayor a 0.' };
    }
    const yaExiste = mes.presupuestos.some(
      (p) => p.categoriaId === categoriaId && p.id !== idAExcluir
    );
    if (yaExiste) {
      return { ok: false, error: 'Ya existe un presupuesto para esta categoría en este mes.' };
    }
    const montoNuevo = montoDePresupuesto({ modo, valor }, mes.ingresoFijo);
    const montoOtros = mes.presupuestos
      .filter((p) => p.id !== idAExcluir)
      .reduce((acc, p) => acc + montoDePresupuesto(p, mes.ingresoFijo), 0) + montoAhorroDe(mes);
    if (montoOtros + montoNuevo > mes.ingresoFijo + 0.01) {
      const disponible = Math.max(mes.ingresoFijo - montoOtros, 0);
      return {
        ok: false,
        error: `La suma de los presupuestos y el ahorro no puede superar el ingreso fijo mensual. Disponible: ${disponible.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.`,
      };
    }
    return { ok: true };
  }, []);

  const agregarPresupuestoCategoria = useCallback((
    categoriaId: string,
    modo: ModoPresupuesto,
    valor: number
  ): { ok: boolean; error?: string; id?: string } => {
    const mes = data.meses[claveMes] ?? crearMesVacio(claveMes);
    const validacion = validarPresupuesto(mes, categoriaId, modo, valor);
    if (!validacion.ok) return validacion;

    const nuevoId = crearId();
    persistir((prev) => {
      const mesActualPrev = prev.meses[claveMes];
      const nuevoPresupuesto: PresupuestoCategoria = { id: nuevoId, categoriaId, modo, valor };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mesActualPrev,
            presupuestos: [...mesActualPrev.presupuestos, nuevoPresupuesto],
          },
        },
      };
    });
    return { ok: true, id: nuevoId };
  }, [claveMes, data.meses, persistir, validarPresupuesto]);

  const editarPresupuestoCategoria = useCallback((
    id: string,
    modo: ModoPresupuesto,
    valor: number
  ): { ok: boolean; error?: string } => {
    const mes = data.meses[claveMes];
    if (!mes) return { ok: false, error: 'No se encontró el mes actual.' };
    const presupuestoExistente = mes.presupuestos.find((p) => p.id === id);
    if (!presupuestoExistente) return { ok: false, error: 'No se encontró el presupuesto.' };

    const validacion = validarPresupuesto(mes, presupuestoExistente.categoriaId, modo, valor, id);
    if (!validacion.ok) return validacion;

    persistir((prev) => {
      const mesActualPrev = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mesActualPrev,
            presupuestos: mesActualPrev.presupuestos.map((p) =>
              p.id === id ? { ...p, modo, valor } : p
            ),
          },
        },
      };
    });
    return { ok: true };
  }, [claveMes, data.meses, persistir, validarPresupuesto]);

  const eliminarPresupuestoCategoria = useCallback((id: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mes,
            presupuestos: mes.presupuestos.filter((p) => p.id !== id),
          },
        },
      };
    });
  }, [claveMes, persistir]);

  return { agregarPresupuestoCategoria, editarPresupuestoCategoria, eliminarPresupuestoCategoria };
}
