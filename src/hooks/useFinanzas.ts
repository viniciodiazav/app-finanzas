import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Ahorro, AhorroDetalle, DatosMes, FinanzasData, Gasto, ModoPresupuesto, PresupuestoCategoria, PresupuestoDetalle } from '../types/finanzas';
import { cargarDatos, guardarDatos } from '../utils/storage';
import { claveMesActual, sumarMeses } from '../utils/mes';
import { esGastoFijoActivoEnMes, estaVencido } from '../utils/gastosFijos';
import { montoDePresupuesto, porcentajeDePresupuesto } from '../utils/presupuesto';

function crearId(): string {
  return crypto.randomUUID();
}

function crearMesVacio(clave: string): DatosMes {
  return {
    clave,
    ingresoFijo: 0,
    presupuestos: [],
    ahorro: null,
    ingresosExtra: [],
    gastos: [],
  };
}

function montoAhorroDe(mes: DatosMes): number {
  return mes.ahorro ? montoDePresupuesto(mes.ahorro, mes.ingresoFijo) : 0;
}

function totalMontoPresupuestos(mes: DatosMes): number {
  return mes.presupuestos.reduce((acc, p) => acc + montoDePresupuesto(p, mes.ingresoFijo), 0);
}

export function useFinanzas() {
  const [data, setData] = useState<FinanzasData>(() => cargarDatos());
  const [claveMes, setClaveMes] = useState<string>(() => claveMesActual());

  const persistir = useCallback((actualizar: (prev: FinanzasData) => FinanzasData) => {
    setData((prev) => {
      const nuevo = actualizar(prev);
      guardarDatos(nuevo);
      return nuevo;
    });
  }, []);

  const asegurarMes = useCallback((clave: string) => {
    persistir((prev) => {
      if (prev.meses[clave]) return prev;

      const nuevoMes = crearMesVacio(clave);

      const gastosFijosActivos = prev.gastosFijos.filter((gf) =>
        esGastoFijoActivoEnMes(gf, clave)
      );
      const gastosGenerados: Gasto[] = gastosFijosActivos.map((gf) => ({
        id: crearId(),
        monto: gf.monto,
        descripcion: gf.descripcion,
        categoriaId: gf.categoriaId,
        fecha: new Date().toISOString(),
        esFijo: true,
        gastoFijoId: gf.id,
      }));
      nuevoMes.gastos = gastosGenerados;

      const gastosFijosVigentes = prev.gastosFijos.filter(
        (gf) => !estaVencido(gf, clave)
      );

      return {
        ...prev,
        gastosFijos: gastosFijosVigentes,
        meses: { ...prev.meses, [clave]: nuevoMes },
      };
    });
  }, [persistir]);

  const irAMes = useCallback((clave: string) => {
    setClaveMes(clave);
    asegurarMes(clave);
  }, [asegurarMes]);

  const mesAnterior = useCallback(() => {
    irAMes(sumarMeses(claveMes, -1));
  }, [claveMes, irAMes]);

  const mesSiguiente = useCallback(() => {
    irAMes(sumarMeses(claveMes, 1));
  }, [claveMes, irAMes]);

  useEffect(() => {
    if (!data.meses[claveMes]) {
      asegurarMes(claveMes);
    }
  }, [claveMes, data.meses, asegurarMes]);

  const mesActual: DatosMes = data.meses[claveMes] ?? crearMesVacio(claveMes);

  const definirIngresoFijo = useCallback((monto: number): { ok: boolean; error?: string } => {
    const mes = data.meses[claveMes];
    if (mes && mes.ingresoFijo > 0) {
      return { ok: false, error: 'El ingreso fijo de este mes ya fue definido y no se puede modificar.' };
    }
    persistir((prev) => ({
      ...prev,
      meses: {
        ...prev.meses,
        [claveMes]: { ...(prev.meses[claveMes] ?? crearMesVacio(claveMes)), ingresoFijo: monto },
      },
    }));
    return { ok: true };
  }, [claveMes, data.meses, persistir]);

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

  const validarAhorro = useCallback((
    mes: DatosMes,
    modo: ModoPresupuesto,
    valor: number
  ): { ok: boolean; error?: string } => {
    if (mes.ingresoFijo <= 0) {
      return { ok: false, error: 'Primero define un ingreso fijo mensual mayor a 0.' };
    }
    const montoNuevo = montoDePresupuesto({ modo, valor }, mes.ingresoFijo);
    const montoOtros = totalMontoPresupuestos(mes);
    if (montoOtros + montoNuevo > mes.ingresoFijo + 0.01) {
      const disponible = Math.max(mes.ingresoFijo - montoOtros, 0);
      return {
        ok: false,
        error: `La suma de los presupuestos y el ahorro no puede superar el ingreso fijo mensual. Disponible: ${disponible.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.`,
      };
    }
    return { ok: true };
  }, []);

  const definirAhorro = useCallback((modo: ModoPresupuesto, valor: number): { ok: boolean; error?: string } => {
    const mes = data.meses[claveMes] ?? crearMesVacio(claveMes);
    const validacion = validarAhorro(mes, modo, valor);
    if (!validacion.ok) return validacion;

    persistir((prev) => {
      const mesActualPrev = prev.meses[claveMes] ?? crearMesVacio(claveMes);
      const nuevoAhorro: Ahorro = { modo, valor };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mesActualPrev, ahorro: nuevoAhorro },
        },
      };
    });
    return { ok: true };
  }, [claveMes, data.meses, persistir, validarAhorro]);

  const eliminarAhorro = useCallback(() => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, ahorro: null },
        },
      };
    });
  }, [claveMes, persistir]);

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

  const agregarIngresoExtra = useCallback((monto: number, descripcion: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      const nuevoIngreso = {
        id: crearId(),
        monto,
        descripcion,
        fecha: new Date().toISOString(),
      };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, ingresosExtra: [...mes.ingresosExtra, nuevoIngreso] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarIngresoExtra = useCallback((id: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mes,
            ingresosExtra: mes.ingresosExtra.filter((i) => i.id !== id),
          },
        },
      };
    });
  }, [claveMes, persistir]);

  const agregarCategoria = useCallback((nombre: string): { ok: boolean; error?: string; id?: string } => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return { ok: false, error: 'El nombre no puede estar vacío.' };

    const nuevoId = crearId();
    let resultado: { ok: boolean; error?: string; id?: string } = { ok: true, id: nuevoId };
    persistir((prev) => {
      const yaExiste = prev.categorias.some(
        (c) => c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
      );
      if (yaExiste) {
        resultado = { ok: false, error: 'Ya existe una categoría con ese nombre.' };
        return prev;
      }
      return {
        ...prev,
        categorias: [...prev.categorias, { id: nuevoId, nombre: nombreLimpio }],
      };
    });
    return resultado;
  }, [persistir]);

  const agregarGasto = useCallback((monto: number, descripcion: string, categoriaId: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      const nuevoGasto: Gasto = {
        id: crearId(),
        monto,
        descripcion,
        categoriaId,
        fecha: new Date().toISOString(),
        esFijo: false,
      };
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: [...mes.gastos, nuevoGasto] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarGasto = useCallback((id: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: mes.gastos.filter((g) => g.id !== id) },
        },
      };
    });
  }, [claveMes, persistir]);

  const agregarGastoFijo = useCallback((
    monto: number,
    descripcion: string,
    categoriaId: string,
    duracionMeses: number | null
  ) => {
    persistir((prev) => {
      const gastoFijoId = crearId();
      const nuevoGastoFijo = {
        id: gastoFijoId,
        monto,
        descripcion,
        categoriaId,
        mesInicio: claveMes,
        duracionMeses,
      };
      const mes = prev.meses[claveMes];
      const gastoGenerado: Gasto = {
        id: crearId(),
        monto,
        descripcion,
        categoriaId,
        fecha: new Date().toISOString(),
        esFijo: true,
        gastoFijoId,
      };
      return {
        ...prev,
        gastosFijos: [...prev.gastosFijos, nuevoGastoFijo],
        meses: {
          ...prev.meses,
          [claveMes]: { ...mes, gastos: [...mes.gastos, gastoGenerado] },
        },
      };
    });
  }, [claveMes, persistir]);

  const eliminarGastoFijo = useCallback((gastoFijoId: string) => {
    persistir((prev) => {
      const mes = prev.meses[claveMes];
      return {
        ...prev,
        gastosFijos: prev.gastosFijos.filter((gf) => gf.id !== gastoFijoId),
        meses: {
          ...prev.meses,
          [claveMes]: {
            ...mes,
            gastos: mes.gastos.filter((g) => g.gastoFijoId !== gastoFijoId),
          },
        },
      };
    });
  }, [claveMes, persistir]);

  const restaurarDatos = useCallback((nuevaData: FinanzasData) => {
    persistir(() => nuevaData);
  }, [persistir]);

  const totalIngresosExtra = useMemo(
    () => mesActual.ingresosExtra.reduce((acc, i) => acc + i.monto, 0),
    [mesActual.ingresosExtra]
  );

  const totalGastos = useMemo(
    () => mesActual.gastos.reduce((acc, g) => acc + g.monto, 0),
    [mesActual.gastos]
  );

  const ingresoTotal = mesActual.ingresoFijo + totalIngresosExtra;

  const presupuestosDetalle: PresupuestoDetalle[] = useMemo(() => {
    return mesActual.presupuestos.map((p) => {
      const nombreCategoria = data.categorias.find((c) => c.id === p.categoriaId)?.nombre ?? 'Sin categoría';
      const monto = montoDePresupuesto(p, mesActual.ingresoFijo);
      const porcentaje = porcentajeDePresupuesto(p, mesActual.ingresoFijo);
      const gastado = mesActual.gastos
        .filter((g) => g.categoriaId === p.categoriaId)
        .reduce((acc, g) => acc + g.monto, 0);
      const restante = monto - gastado;
      return {
        ...p,
        nombreCategoria,
        monto,
        porcentaje,
        gastado,
        restante,
        sobregasto: restante < 0,
      };
    });
  }, [mesActual.presupuestos, mesActual.gastos, mesActual.ingresoFijo, data.categorias]);

  const totalPresupuestado = useMemo(
    () => presupuestosDetalle.reduce((acc, p) => acc + p.monto, 0),
    [presupuestosDetalle]
  );

  const ahorroDetalle: AhorroDetalle | null = useMemo(() => {
    if (!mesActual.ahorro) return null;
    return {
      ...mesActual.ahorro,
      monto: montoDePresupuesto(mesActual.ahorro, mesActual.ingresoFijo),
      porcentaje: porcentajeDePresupuesto(mesActual.ahorro, mesActual.ingresoFijo),
    };
  }, [mesActual.ahorro, mesActual.ingresoFijo]);

  const montoAhorro = ahorroDetalle?.monto ?? 0;

  const disponibleParaPresupuestar = Math.max(mesActual.ingresoFijo - totalPresupuestado - montoAhorro, 0);

  return {
    data,
    claveMes,
    mesActual,
    categorias: data.categorias,
    gastosFijos: data.gastosFijos,
    irAMes,
    mesAnterior,
    mesSiguiente,
    definirIngresoFijo,
    agregarPresupuestoCategoria,
    editarPresupuestoCategoria,
    eliminarPresupuestoCategoria,
    definirAhorro,
    eliminarAhorro,
    agregarIngresoExtra,
    eliminarIngresoExtra,
    agregarCategoria,
    agregarGasto,
    eliminarGasto,
    agregarGastoFijo,
    eliminarGastoFijo,
    restaurarDatos,
    totalIngresosExtra,
    totalGastos,
    ingresoTotal,
    presupuestosDetalle,
    totalPresupuestado,
    ahorroDetalle,
    montoAhorro,
    disponibleParaPresupuestar,
  };
}

export type UseFinanzasReturn = ReturnType<typeof useFinanzas>;
