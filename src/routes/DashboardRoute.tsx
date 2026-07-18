import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { Header } from '../components/Header';
import { IngresoSeccion } from '../components/IngresoSeccion';
import { PresupuestosLista } from '../components/PresupuestosLista';
import { AhorroSeccion } from '../components/AhorroSeccion';
import { GastoFijoSeccion } from '../components/GastoFijoSeccion';
import { BackupBar } from '../components/BackupBar';
import { NavegacionSecundaria } from '../components/dashboard/NavegacionSecundaria';
import { ModalesDashboard, type ModalActivo } from '../components/dashboard/ModalesDashboard';
import { exportarDatos, importarDatos } from '../utils/backup';

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
          <NavegacionSecundaria />

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

      <ModalesDashboard
        modalActivo={modalActivo}
        onCerrar={() => setModalActivo(null)}
        categorias={categorias}
        categoriasConPresupuesto={categoriasConPresupuesto}
        ingresoFijo={mesActual.ingresoFijo}
        disponibleParaPresupuestar={disponibleParaPresupuestar}
        ahorroDetalle={ahorroDetalle}
        onDefinirIngresoFijo={definirIngresoFijo}
        onCrearCategoria={agregarCategoria}
        onGuardarPresupuestoNuevo={agregarPresupuestoCategoria}
        onGuardarPresupuestoEdicion={editarPresupuestoCategoria}
        onDefinirAhorro={definirAhorro}
        onAgregarIngresoExtra={agregarIngresoExtra}
        onAgregarGastoFijo={agregarGastoFijo}
      />
    </div>
  );
}
