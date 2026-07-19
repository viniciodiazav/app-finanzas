import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IngresoSeccion } from './IngresoSeccion';
import type { IngresoExtra } from '../types/finanzas';

const propsBase = {
  ingresoFijo: 20000,
  ingresosExtra: [] as IngresoExtra[],
  totalIngresosExtra: 0,
  totalGastos: 0,
  totalPresupuestado: 0,
  montoAhorro: 0,
  disponibleParaPresupuestar: 20000,
  onDefinirIngresoFijo: vi.fn(),
  onAgregarIngresoExtra: vi.fn(),
  onEliminarIngresoExtra: vi.fn(),
};

describe('IngresoSeccion', () => {
  it('muestra el botón de definir ingreso fijo cuando aún no está definido', () => {
    const onDefinirIngresoFijo = vi.fn();
    render(<IngresoSeccion {...propsBase} ingresoFijo={0} onDefinirIngresoFijo={onDefinirIngresoFijo} />);

    fireEvent.click(screen.getByText('+ Definir ingreso fijo'));
    expect(onDefinirIngresoFijo).toHaveBeenCalled();
  });

  it('muestra el monto del ingreso fijo cuando ya está definido', () => {
    render(<IngresoSeccion {...propsBase} />);
    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
  });

  it('llama a onAgregarIngresoExtra al hacer click en el botón', () => {
    const onAgregarIngresoExtra = vi.fn();
    render(<IngresoSeccion {...propsBase} onAgregarIngresoExtra={onAgregarIngresoExtra} />);

    fireEvent.click(screen.getByText('+ Ingreso extra'));
    expect(onAgregarIngresoExtra).toHaveBeenCalled();
  });

  it('despliega el historial de ingresos extra y permite eliminarlos con confirmación', () => {
    const ingresosExtra: IngresoExtra[] = [
      { id: 'i1', monto: 500, descripcion: 'Bono', fecha: '2026-07-10T00:00:00.000Z' },
    ];
    const onEliminarIngresoExtra = vi.fn();
    render(
      <IngresoSeccion
        {...propsBase}
        ingresosExtra={ingresosExtra}
        totalIngresosExtra={500}
        onEliminarIngresoExtra={onEliminarIngresoExtra}
      />
    );

    fireEvent.click(screen.getByText(/Ver historial/));
    expect(screen.getByText('Bono')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar ingreso extra' }));
    expect(screen.getByText(/¿Eliminar el ingreso extra "Bono" de \$500.00\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onEliminarIngresoExtra).toHaveBeenCalledWith('i1');
  });
});
