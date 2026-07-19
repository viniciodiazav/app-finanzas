import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalesDashboard } from './ModalesDashboard';
import type { Categoria } from '../../types/finanzas';

const categorias: Categoria[] = [{ id: 'c1', nombre: 'Comida' }];

const propsBase = {
  onCerrar: vi.fn(),
  categorias,
  categoriasConPresupuesto: categorias,
  ingresoFijo: 20000,
  disponibleParaPresupuestar: 10000,
  ahorroDetalle: null,
  onDefinirIngresoFijo: vi.fn(),
  onCrearCategoria: vi.fn(),
  onGuardarPresupuestoNuevo: vi.fn(),
  onGuardarPresupuestoEdicion: vi.fn(),
  onDefinirAhorro: vi.fn(),
  onAgregarIngresoExtra: vi.fn(),
  onAgregarGastoFijo: vi.fn(),
};

describe('ModalesDashboard', () => {
  it('no renderiza nada cuando modalActivo es null', () => {
    const { container } = render(<ModalesDashboard {...propsBase} modalActivo={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza ModalIngresoFijo', () => {
    render(<ModalesDashboard {...propsBase} modalActivo="ingresoFijo" />);
    expect(screen.getByText('Definir ingreso fijo mensual')).toBeInTheDocument();
  });

  it('renderiza ModalPresupuestoCategoria', () => {
    render(<ModalesDashboard {...propsBase} modalActivo="presupuestoNuevo" />);
    expect(screen.getByText('Nuevo presupuesto por categoría')).toBeInTheDocument();
  });

  it('renderiza ModalAhorro', () => {
    render(<ModalesDashboard {...propsBase} modalActivo="ahorro" />);
    expect(screen.getByText('Definir ahorro mensual')).toBeInTheDocument();
  });

  it('renderiza ModalIngresoExtra', () => {
    render(<ModalesDashboard {...propsBase} modalActivo="ingresoExtra" />);
    expect(screen.getByText('Agregar ingreso extra')).toBeInTheDocument();
  });

  it('renderiza ModalGastoFijo', () => {
    render(<ModalesDashboard {...propsBase} modalActivo="gastoFijo" />);
    expect(screen.getByText('Agregar gasto fijo')).toBeInTheDocument();
  });
});
