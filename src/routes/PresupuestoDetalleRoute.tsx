import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { PresupuestoDetalleScreen } from '../components/PresupuestoDetalleScreen';
import { ModalPresupuestoCategoria } from '../components/ModalPresupuestoCategoria';
import { ModalGasto } from '../components/ModalGasto';

type ModalActivo = 'presupuestoEditar' | 'gasto' | null;

interface PresupuestoDetalleRouteProps {
  finanzas: UseFinanzasReturn;
}

export function PresupuestoDetalleRoute({ finanzas }: PresupuestoDetalleRouteProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalActivo, setModalActivo] = useState<ModalActivo>(null);

  const {
    mesActual,
    categorias,
    presupuestosDetalle,
    disponibleParaPresupuestar,
    agregarCategoria,
    agregarPresupuestoCategoria,
    editarPresupuestoCategoria,
    eliminarPresupuestoCategoria,
    agregarGasto,
    eliminarGasto,
  } = finanzas;

  const presupuesto = presupuestosDetalle.find((p) => p.id === id);

  if (!presupuesto) {
    return <Navigate to="/" replace />;
  }

  const gastosDeLaCategoria = mesActual.gastos.filter((g) => g.categoriaId === presupuesto.categoriaId);

  return (
    <>
      <PresupuestoDetalleScreen
        presupuesto={presupuesto}
        gastos={gastosDeLaCategoria}
        onVolver={() => navigate('/')}
        onEditar={() => setModalActivo('presupuestoEditar')}
        onEliminar={() => {
          eliminarPresupuestoCategoria(presupuesto.id);
          navigate('/');
        }}
        onAgregarGasto={() => setModalActivo('gasto')}
        onEliminarGasto={eliminarGasto}
      />

      {modalActivo === 'presupuestoEditar' && (
        <ModalPresupuestoCategoria
          presupuestoExistente={presupuesto}
          categorias={categorias}
          ingresoFijo={mesActual.ingresoFijo}
          disponibleParaPresupuestar={disponibleParaPresupuestar}
          onCrearCategoria={agregarCategoria}
          onGuardarNuevo={agregarPresupuestoCategoria}
          onGuardarEdicion={editarPresupuestoCategoria}
          onCerrar={() => setModalActivo(null)}
        />
      )}

      {modalActivo === 'gasto' && (
        <ModalGasto
          categoriaId={presupuesto.categoriaId}
          onGuardar={agregarGasto}
          onCerrar={() => setModalActivo(null)}
        />
      )}
    </>
  );
}
