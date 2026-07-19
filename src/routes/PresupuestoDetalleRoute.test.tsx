import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PresupuestoDetalleRoute } from './PresupuestoDetalleRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(PresupuestoDetalleRoute);

function seed(data: FinanzasData) {
  localStorage.setItem('finanzas-app-data', JSON.stringify(data));
}

const datosBase: FinanzasData = {
  categorias: [{ id: 'c1', nombre: 'Comida' }],
  gastosFijos: [],
  meses: {
    '2026-07': {
      clave: '2026-07',
      ingresoFijo: 20000,
      presupuestos: [{ id: 'p1', categoriaId: 'c1', modo: 'monto', valor: 3000 }],
      ahorro: null,
      ingresosExtra: [],
      gastos: [
        { id: 'g1', monto: 300, descripcion: 'Super', categoriaId: 'c1', fecha: '2026-07-10T00:00:00.000Z', esFijo: false },
      ],
    },
  },
};

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15));
});

afterEach(() => {
  vi.useRealTimers();
});

function renderRuta(idInicial: string) {
  return render(
    <MemoryRouter initialEntries={[`/presupuestos/${idInicial}`]}>
      <Routes>
        <Route path="/" element={<p>Pantalla del dashboard</p>} />
        <Route path="/presupuestos/:id" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PresupuestoDetalleRoute', () => {
  it('muestra el presupuesto y sus gastos según el id de la URL', () => {
    seed(datosBase);
    renderRuta('p1');

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('Super')).toBeInTheDocument();
    expect(screen.getByText(/Restante:/)).toBeInTheDocument();
  });

  it('redirige a "/" cuando el id no corresponde a ningún presupuesto', () => {
    seed(datosBase);
    renderRuta('id-inexistente');

    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });

  it('agregar un gasto nuevo actualiza el total gastado en la misma pantalla', () => {
    seed(datosBase);
    renderRuta('p1');

    fireEvent.click(screen.getByText('+ Agregar gasto'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '200' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Supermercado'), { target: { value: 'Restaurante' } });
    fireEvent.click(screen.getByText('Guardar gasto'));

    expect(screen.getByText('Restaurante')).toBeInTheDocument();
    expect(screen.getByText(/Gastado: \$500.00/)).toBeInTheDocument();
  });

  it('eliminar el presupuesto redirige a "/"', () => {
    seed(datosBase);
    renderRuta('p1');

    fireEvent.click(screen.getByText('Eliminar'));
    const botones = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(botones[botones.length - 1]);

    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });

  it('editar el presupuesto refleja el nuevo monto', () => {
    seed(datosBase);
    renderRuta('p1');

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByDisplayValue('3000'), { target: { value: '5000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
  });
});
