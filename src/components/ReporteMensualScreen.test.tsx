import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReporteMensualScreen } from './ReporteMensualScreen';
import type { PresupuestoDetalle } from '../types/finanzas';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15));
});

afterEach(() => {
  vi.useRealTimers();
});

const presupuestos: PresupuestoDetalle[] = [
  {
    id: 'p1',
    categoriaId: 'c1',
    modo: 'monto',
    valor: 1000,
    nombreCategoria: 'Comida',
    monto: 1000,
    porcentaje: 10,
    gastado: 500,
    restante: 500,
    sobregasto: false,
  },
];

describe('ReporteMensualScreen', () => {
  it('muestra cuánto sobra cuando el balance es positivo', () => {
    render(
      <ReporteMensualScreen
        claveMes="2026-07"
        ingresoTotal={10000}
        totalGastos={500}
        ahorro={null}
        presupuestos={presupuestos}
        gastoMesAnterior={null}
        onVolver={vi.fn()}
      />
    );

    expect(screen.getByText('Hasta ahora te sobran')).toBeInTheDocument();
    expect(screen.getByText('$9,500.00')).toBeInTheDocument();
  });

  it('muestra el balance en negativo cuando el gasto supera el ingreso', () => {
    render(
      <ReporteMensualScreen
        claveMes="2026-07"
        ingresoTotal={1000}
        totalGastos={1500}
        ahorro={null}
        presupuestos={presupuestos}
        gastoMesAnterior={null}
        onVolver={vi.fn()}
      />
    );

    expect(screen.getByText('Hasta ahora vas en negativo por')).toBeInTheDocument();
    expect(screen.getAllByText('$500.00').length).toBeGreaterThan(0);
  });

  it('llama a onVolver al hacer click en el botón de volver', () => {
    const onVolver = vi.fn();
    render(
      <ReporteMensualScreen
        claveMes="2026-07"
        ingresoTotal={0}
        totalGastos={0}
        ahorro={null}
        presupuestos={[]}
        gastoMesAnterior={null}
        onVolver={onVolver}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(onVolver).toHaveBeenCalled();
  });
});
