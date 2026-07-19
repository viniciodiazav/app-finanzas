import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalIngresoFijo } from './ModalIngresoFijo';

describe('ModalIngresoFijo', () => {
  it('valida que el monto sea mayor a 0 antes de pedir confirmación', () => {
    render(<ModalIngresoFijo onGuardar={vi.fn()} onCerrar={vi.fn()} />);

    fireEvent.click(screen.getByText('Continuar'));
    expect(screen.getByText('Ingresa un monto válido mayor a 0.')).toBeInTheDocument();
  });

  it('pide confirmación antes de guardar y muestra el monto a confirmar', () => {
    render(<ModalIngresoFijo onGuardar={vi.fn()} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '15000' } });
    fireEvent.click(screen.getByText('Continuar'));

    expect(screen.getByText('$15,000.00')).toBeInTheDocument();
    expect(screen.getByText('Confirmar ingreso fijo mensual')).toBeInTheDocument();
  });

  it('permite volver de la confirmación sin guardar', () => {
    const onGuardar = vi.fn();
    render(<ModalIngresoFijo onGuardar={onGuardar} onCerrar={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '15000' } });
    fireEvent.click(screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Volver'));

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('llama a onGuardar al confirmar y cierra el modal si fue exitoso', () => {
    const onGuardar = vi.fn().mockReturnValue({ ok: true });
    const onCerrar = vi.fn();
    render(<ModalIngresoFijo onGuardar={onGuardar} onCerrar={onCerrar} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '15000' } });
    fireEvent.click(screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Confirmar'));

    expect(onGuardar).toHaveBeenCalledWith(15000);
    expect(onCerrar).toHaveBeenCalled();
  });

  it('muestra el error y vuelve al formulario si onGuardar falla', () => {
    const onGuardar = vi.fn().mockReturnValue({ ok: false, error: 'Ya fue definido.' });
    const onCerrar = vi.fn();
    render(<ModalIngresoFijo onGuardar={onGuardar} onCerrar={onCerrar} />);

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '15000' } });
    fireEvent.click(screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Confirmar'));

    expect(screen.getByText('Ya fue definido.')).toBeInTheDocument();
    expect(onCerrar).not.toHaveBeenCalled();
  });
});
