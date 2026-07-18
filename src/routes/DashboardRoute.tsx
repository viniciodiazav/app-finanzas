import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { Header } from '../components/Header';
import { IngresoSeccion } from '../components/IngresoSeccion';
import { PresupuestosLista } from '../components/PresupuestosLista';
import { AhorroSeccion } from '../components/AhorroSeccion';
import { GastoFijoSeccion } from '../components/GastoFijoSeccion';
import { BackupBar } from '../components/BackupBar';
import { ModalIngresoFijo } from '../components/ModalIngresoFijo';
import { ModalPresupuestoCategoria } from '../components/ModalPresupuestoCategoria';
import { ModalAhorro } from '../components/ModalAhorro';
import { ModalIngresoExtra } from '../components/ModalIngresoExtra';
import { ModalGastoFijo } from '../components/ModalGastoFijo';
import { exportarDatos, importarDatos } from '../utils/backup';

type ModalActivo = 'ingresoFijo' | 'presupuestoNuevo' | 'ahorro' | 'ingresoExtra' | 'gastoFijo' | null;

interface DashboardRouteProps {
  finanzas: UseFinanzasReturn;
}

export function DashboardRoute({ finanzas }: DashboardRouteProps) {
  const {
    data,
    claveMes,
    mesActual,
    categorias,
    mesAnterior,
    mesSiguiente,
    definirIngresoFijo,
    agregarPresupuestoCategoria,
    editarPresupuestoCategoria,
    definirAhorro,
    eliminarAhorro,
    agregarIngresoExtra,
    eliminarIngresoExtra,
    agregarCategoria,
    agregarGastoFijo,
    restaurarDatos,
    totalIngresosExtra,
    totalGastos,
    presupuestosDetalle,
    totalPresupuestado,
    ahorroDetalle,
    montoAhorro,
    disponibleParaPresupuestar,
  } = finanzas;

  const navigate = useNavigate();
  const [modalActivo, setModalActivo] = useState<ModalActivo>(null);

  const categoriasConPresupuesto = categorias.filter((c) =>
    presupuestosDetalle.some((p) => p.categoriaId === c.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="max-w-lg mx-auto">
        <Header claveMes={claveMes} onMesAnterior={mesAnterior} onMesSiguiente={mesSiguiente} />

        <main className="flex flex-col gap-4 px-4 mt-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => navigate('/reporte')}
              className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              Reporte
            </button>
            <button
              onClick={() => navigate('/estadisticas')}
              className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100"
            >
              Estadísticas
            </button>
            <button
              onClick={() => navigate('/historial')}
              className="text-xs sm:text-sm font-semibold py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              Historial
            </button>
          </div>

          <IngresoSeccion
            ingresoFijo={mesActual.ingresoFijo}
            ingresosExtra={mesActual.ingresosExtra}
            totalIngresosExtra={totalIngresosExtra}
            totalGastos={totalGastos}
            totalPresupuestado={totalPresupuestado}
            montoAhorro={montoAhorro}
            disponibleParaPresupuestar={disponibleParaPresupuestar}
            onDefinirIngresoFijo={() => setModalActivo('ingresoFijo')}
            onAgregarIngresoExtra={() => setModalActivo('ingresoExtra')}
            onEliminarIngresoExtra={eliminarIngresoExtra}
          />

          <AhorroSeccion
            ahorro={ahorroDetalle}
            onDefinirAhorro={() => setModalActivo('ahorro')}
            onEliminarAhorro={eliminarAhorro}
          />

          <PresupuestosLista
            presupuestos={presupuestosDetalle}
            totalPresupuestado={totalPresupuestado}
            ingresoFijo={mesActual.ingresoFijo}
            onAgregarPresupuesto={() => setModalActivo('presupuestoNuevo')}
            onVerDetalle={(id) => navigate(`/presupuestos/${id}`)}
          />

          <GastoFijoSeccion onAgregarGastoFijo={() => setModalActivo('gastoFijo')} />
        </main>

        <BackupBar
          onExportar={() => exportarDatos(data)}
          onImportar={async (archivo) => {
            try {
              const nuevaData = await importarDatos(archivo);
              restaurarDatos(nuevaData);
            } catch (e) {
              alert(e instanceof Error ? e.message : 'Error al importar el archivo.');
            }
          }}
        />
      </div>

      {modalActivo === 'ingresoFijo' && (
        <ModalIngresoFijo
          onGuardar={definirIngresoFijo}
          onCerrar={() => setModalActivo(null)}
        />
      )}

      {modalActivo === 'presupuestoNuevo' && (
        <ModalPresupuestoCategoria
          categorias={categorias}
          ingresoFijo={mesActual.ingresoFijo}
          disponibleParaPresupuestar={disponibleParaPresupuestar}
          onCrearCategoria={agregarCategoria}
          onGuardarNuevo={agregarPresupuestoCategoria}
          onGuardarEdicion={editarPresupuestoCategoria}
          onCerrar={() => setModalActivo(null)}
        />
      )}

      {modalActivo === 'ahorro' && (
        <ModalAhorro
          ahorroExistente={ahorroDetalle}
          ingresoFijo={mesActual.ingresoFijo}
          disponibleParaPresupuestar={disponibleParaPresupuestar}
          onGuardar={definirAhorro}
          onCerrar={() => setModalActivo(null)}
        />
      )}

      {modalActivo === 'ingresoExtra' && (
        <ModalIngresoExtra
          onGuardar={agregarIngresoExtra}
          onCerrar={() => setModalActivo(null)}
        />
      )}

      {modalActivo === 'gastoFijo' && (
        <ModalGastoFijo
          categorias={categoriasConPresupuesto}
          onGuardar={agregarGastoFijo}
          onCerrar={() => setModalActivo(null)}
        />
      )}
    </div>
  );
}
