import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 15)); // 15 de julio 2026
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Header', () => {
  it('muestra el nombre del mes y llama a los callbacks de navegación', () => {
    const onMesAnterior = vi.fn();
    const onMesSiguiente = vi.fn();
    render(<Header claveMes="2026-07" onMesAnterior={onMesAnterior} onMesSiguiente={onMesSiguiente} />);

    expect(screen.getByText('Julio 2026')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(onMesAnterior).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(onMesSiguiente).toHaveBeenCalled();
  });

  it('marca el mes como "Futuro" cuando corresponde a un mes posterior al actual', () => {
    render(<Header claveMes="2026-08" onMesAnterior={vi.fn()} onMesSiguiente={vi.fn()} />);

    expect(screen.getByText('Futuro')).toBeInTheDocument();
  });

  it('no muestra la etiqueta "Futuro" para el mes actual', () => {
    render(<Header claveMes="2026-07" onMesAnterior={vi.fn()} onMesSiguiente={vi.fn()} />);

    expect(screen.queryByText('Futuro')).not.toBeInTheDocument();
  });
});
