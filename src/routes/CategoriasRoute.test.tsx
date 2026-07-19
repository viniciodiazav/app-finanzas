import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriasRoute } from './CategoriasRoute';
import { crearHarnessFinanzas } from '../test/crearHarnessFinanzas';
import type { FinanzasData } from '../types/finanzas';

const Harness = crearHarnessFinanzas(CategoriasRoute);

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
    <MemoryRouter initialEntries={['/categorias']}>
      <Routes>
        <Route path="/" element={<p>Pantalla del dashboard</p>} />
        <Route path="/categorias" element={<Harness />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CategoriasRoute', () => {
  it('marca como en uso la categoría con un presupuesto asociado en algún mes', () => {
    seed({
      categorias: [
        { id: 'c1', nombre: 'Comida' },
        { id: 'c2', nombre: 'Ocio' },
      ],
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

    renderRuta();

    fireEvent.click(screen.getByText('Comida').closest('li')!.querySelector('button:last-of-type')!);
    expect(
      screen.getByText('"Comida" tiene presupuestos o gastos asociados y no se puede eliminar.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ocio').closest('li')!.querySelector('button:last-of-type')!);
    expect(screen.getByText('¿Eliminar la categoría "Ocio"?')).toBeInTheDocument();
  });

  it('renombrar una categoría persiste el cambio a través del hook real', () => {
    seed({
      categorias: [{ id: 'c1', nombre: 'Comida' }],
      gastosFijos: [],
      meses: {},
    });

    renderRuta();

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByDisplayValue('Comida'), { target: { value: 'Comida y bebidas' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('Comida y bebidas')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('finanzas-app-data')!).categorias[0].nombre).toBe(
      'Comida y bebidas'
    );
  });

  it('el botón de volver navega a "/"', () => {
    seed({ categorias: [], gastosFijos: [], meses: {} });
    renderRuta();

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(screen.getByText('Pantalla del dashboard')).toBeInTheDocument();
  });
});
