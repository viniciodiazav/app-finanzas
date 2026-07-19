import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReporteRoute } from './ReporteRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(ReporteRoute);

function seed(data: FinanzasData) {
  localStorage.setItem('finanzas-app-data', JSON.stringify(data));
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15)); // 15 de julio 2026
});

afterEach(() => {
  vi.useRealTimers();
});

function renderRuta() {
  return render(
    <MemoryRouter initialEntries={['/reporte']}>
      <Routes>
        <Route path="/" element={<p>Pantalla del dashboard</p>} />
        <Route path="/reporte" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ReporteRoute', () => {
  it('calcula el gasto del mes anterior a partir de data.meses, no del mes actual', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-06': {
          clave: '2026-06',
          ingresoFijo: 15000,
          presupuestos: [],
          ahorro: null,
          ingresosExtra: [],
          gastos: [
            { id: 'g0', monto: 1000, descripcion: 'Junio', categoriaId: 'c1', fecha: '2026-06-10T00:00:00.000Z', esFijo: false },
          ],
        },
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [{ id: 'p1', categoriaId: 'c1', modo: 'monto', valor: 3000 }],
          ahorro: null,
          ingresosExtra: [],
          gastos: [
            { id: 'g1', monto: 800, descripcion: 'Julio', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
          ],
        },
      },
    });

    renderRuta();

    // Gastó 800 este mes contra 1000 el mes anterior: 200 menos (20% menos).
    expect(screen.getByText(/Gastaste \$200.00 menos que el mes pasado \(20% menos\)/)).toBeInTheDocument();
  });

  it('no compara contra el mes anterior cuando este no tiene datos registrados', () => {
    seed({
      categorias: [],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [],
          ahorro: null,
          ingresosExtra: [],
          gastos: [],
        },
      },
    });

    renderRuta();

    expect(screen.queryByText(/que el mes pasado/)).not.toBeInTheDocument();
  });

  it('el botón de volver navega a "/"', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    renderRuta();

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });
});
