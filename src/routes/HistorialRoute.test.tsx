import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HistorialRoute } from './HistorialRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(HistorialRoute);

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
    <MemoryRouter initialEntries={['/historial']}>
      <Routes>
        <Route path="/" element={<p>Pantalla del dashboard</p>} />
        <Route path="/historial" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('HistorialRoute', () => {
  it('muestra los gastos del mes actual con el nombre de su categoría', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [],
          ahorro: null,
          ingresosExtra: [],
          gastos: [
            { id: 'g1', monto: 300, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
          ],
        },
      },
    });

    renderRuta();

    expect(screen.getByText('Super')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('eliminar un gasto lo remueve de la lista tras confirmar', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [],
          ahorro: null,
          ingresosExtra: [],
          gastos: [
            { id: 'g1', monto: 300, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
          ],
        },
      },
    });

    renderRuta();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar gasto' }));
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(screen.queryByText('Super')).not.toBeInTheDocument();
    expect(screen.getByText('Aún no hay gastos registrados este mes.')).toBeInTheDocument();
  });

  it('el botón de volver navega a "/"', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    renderRuta();

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });
});
