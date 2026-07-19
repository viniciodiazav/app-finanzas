import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EstadisticasRoute } from './EstadisticasRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(EstadisticasRoute);

function seed(data: FinanzasData) {
  localStorage.setItem('finanzas-app-data', JSON.stringify(data));
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15));
});

afterEach(() => {
  vi.useRealTimers();
});

function renderRuta() {
  return render(
    <MemoryRouter initialEntries={['/estadisticas']}>
      <Routes>
        <Route path="/" element={<p>Pantalla del dashboard</p>} />
        <Route path="/estadisticas" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('EstadisticasRoute', () => {
  it('muestra los totales calculados a partir del estado real de useFinanzas', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [{ id: 'p1', categoriaId: 'c1', modo: 'monto', valor: 3000 }],
          ahorro: { modo: 'monto', valor: 1000 },
          ingresosExtra: [],
          gastos: [
            { id: 'g1', monto: 500, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
          ],
        },
      },
    });

    renderRuta();

    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText(/\$1,000.00 \(5.0%\)/)).toBeInTheDocument();
    expect(screen.getAllByText('Comida').length).toBeGreaterThan(0);
  });

  it('el botón de volver navega a "/"', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    renderRuta();

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });
});
