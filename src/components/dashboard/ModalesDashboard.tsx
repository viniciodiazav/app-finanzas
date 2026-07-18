import type { AhorroDetalle, Categoria, ModoPresupuesto } from '../../types/finanzas';
import { ModalIngresoFijo } from '../ModalIngresoFijo';
import { ModalPresupuestoCategoria } from '../ModalPresupuestoCategoria';
import { ModalAhorro } from '../ModalAhorro';
import { ModalIngresoExtra } from '../ModalIngresoExtra';
import { ModalGastoFijo } from '../ModalGastoFijo';

export type ModalActivo = 'ingresoFijo' | 'presupuestoNuevo' | 'ahorro' | 'ingresoExtra' | 'gastoFijo' | null;

interface ModalesDashboardProps {
  modalActivo: ModalActivo;
  onCerrar: () => void;
  categorias: Categoria[];
  categoriasConPresupuesto: Categoria[];
  ingresoFijo: number;
  disponibleParaPresupuestar: number;
  ahorroDetalle: AhorroDetalle | null;
  onDefinirIngresoFijo: (monto: number) => { ok: boolean; error?: string };
  onCrearCategoria: (nombre: string) => { ok: boolean; error?: string; id?: string };
  onGuardarPresupuestoNuevo: (
    categoriaId: string,
    modo: ModoPresupuesto,
    valor: number
  ) => { ok: boolean; error?: string };
  onGuardarPresupuestoEdicion: (id: string, modo: ModoPresupuesto, valor: number) => { ok: boolean; error?: string };
  onDefinirAhorro: (modo: ModoPresupuesto, valor: number) => { ok: boolean; error?: string };
  onAgregarIngresoExtra: (monto: number, descripcion: string) => void;
  onAgregarGastoFijo: (
    monto: number,
    descripcion: string,
    categoriaId: string,
    duracionMeses: number | null
  ) => void;
}

export function ModalesDashboard({
  modalActivo,
  onCerrar,
  categorias,
  categoriasConPresupuesto,
  ingresoFijo,
  disponibleParaPresupuestar,
  ahorroDetalle,
  onDefinirIngresoFijo,
  onCrearCategoria,
  onGuardarPresupuestoNuevo,
  onGuardarPresupuestoEdicion,
  onDefinirAhorro,
  onAgregarIngresoExtra,
  onAgregarGastoFijo,
}: ModalesDashboardProps) {
  if (modalActivo === 'ingresoFijo') {
    return <ModalIngresoFijo onGuardar={onDefinirIngresoFijo} onCerrar={onCerrar} />;
  }

  if (modalActivo === 'presupuestoNuevo') {
    return (
      <ModalPresupuestoCategoria
        categorias={categorias}
        ingresoFijo={ingresoFijo}
        disponibleParaPresupuestar={disponibleParaPresupuestar}
        onCrearCategoria={onCrearCategoria}
        onGuardarNuevo={onGuardarPresupuestoNuevo}
        onGuardarEdicion={onGuardarPresupuestoEdicion}
        onCerrar={onCerrar}
      />
    );
  }

  if (modalActivo === 'ahorro') {
    return (
      <ModalAhorro
        ahorroExistente={ahorroDetalle}
        ingresoFijo={ingresoFijo}
        disponibleParaPresupuestar={disponibleParaPresupuestar}
        onGuardar={onDefinirAhorro}
        onCerrar={onCerrar}
      />
    );
  }

  if (modalActivo === 'ingresoExtra') {
    return <ModalIngresoExtra onGuardar={onAgregarIngresoExtra} onCerrar={onCerrar} />;
  }

  if (modalActivo === 'gastoFijo') {
    return (
      <ModalGastoFijo
        categorias={categoriasConPresupuesto}
        onGuardar={onAgregarGastoFijo}
        onCerrar={onCerrar}
      />
    );
  }

  return null;
}
