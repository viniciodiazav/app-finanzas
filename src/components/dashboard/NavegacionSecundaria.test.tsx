import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NavegacionSecundaria } from './NavegacionSecundaria';

function renderConRutas() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<NavegacionSecundaria />} />
        <Route path="/reporte" element={<p>Pantalla de reporte</p>} />
        <Route path="/estadisticas" element={<p>Pantalla de estadísticas</p>} />
        <Route path="/historial" element={<p>Pantalla de historial</p>} />
        <Route path="/categorias" element={<p>Pantalla de categorías</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('NavegacionSecundaria', () => {
  it('navega a /reporte', () => {
    renderConRutas();
    fireEvent.click(screen.getByText('Reporte'));
    expect(screen.getByText('Pantalla de reporte')).toBeInTheDocument();
  });

  it('navega a /estadisticas', () => {
    renderConRutas();
    fireEvent.click(screen.getByText('Estadísticas'));
    expect(screen.getByText('Pantalla de estadísticas')).toBeInTheDocument();
  });

  it('navega a /historial', () => {
    renderConRutas();
    fireEvent.click(screen.getByText('Historial'));
    expect(screen.getByText('Pantalla de historial')).toBeInTheDocument();
  });

  it('navega a /categorias', () => {
    renderConRutas();
    fireEvent.click(screen.getByText('Categorías'));
    expect(screen.getByText('Pantalla de categorías')).toBeInTheDocument();
  });
});
