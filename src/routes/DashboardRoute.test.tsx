import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardRoute } from './DashboardRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(DashboardRoute);

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

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Harness />} />
        <Route path="/reporte" element={<p>Pantalla de reporte</p>} />
        <Route path="/estadisticas" element={<p>Pantalla de estadísticas</p>} />
        <Route path="/historial" element={<p>Pantalla de historial</p>} />
        <Route path="/categorias" element={<p>Pantalla de categorías</p>} />
        <Route path="/presupuestos/:id" element={<p>Detalle de presupuesto</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DashboardRoute', () => {
  it('muestra el ingreso fijo y los presupuestos del mes desde el estado real de useFinanzas', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [{ id: 'p1', categoriaId: 'c1', modo: 'monto', valor: 3000 }],
          ahorro: null,
          ingresosExtra: [],
          gastos: [],
        },
      },
    });

    renderDashboard();

    expect(screen.getByText('$20,000.00')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('navega al detalle del presupuesto al hacer click en él', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {
        '2026-07': {
          clave: '2026-07',
          ingresoFijo: 20000,
          presupuestos: [{ id: 'p1', categoriaId: 'c1', modo: 'monto', valor: 3000 }],
          ahorro: null,
          ingresosExtra: [],
          gastos: [],
        },
      },
    });

    renderDashboard();
    fireEvent.click(screen.getByText('Comida'));

    expect(screen.getByText('Detalle de presupuesto')).toBeInTheDocument();
  });

  it('navega a las pantallas secundarias', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    renderDashboard();

    fireEvent.click(screen.getByText('Historial'));
    expect(screen.getByText('Pantalla de historial')).toBeInTheDocument();
  });

  it('crear un presupuesto nuevo a través del modal actualiza la lista sin recargar la ruta', () => {
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

    renderDashboard();

    fireEvent.click(screen.getByText('+ Nuevo presupuesto'));
    fireEvent.change(screen.getByPlaceholderText('Ej. Comida, Transporte...'), {
      target: { value: 'Ocio' },
    });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('Ocio')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('exporta el respaldo con los datos actuales', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    const createObjectURL = vi.fn().mockReturnValue('blob:mock');
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    renderDashboard();
    fireEvent.click(screen.getByText('Exportar respaldo'));

    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
  });
});
