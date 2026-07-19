import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalAhorro } from './ModalAhorro';

describe('ModalAhorro', () => {
  it('valida que el valor sea mayor a 0', () => {
    const onGuardar = vi.fn();
    render(
      <ModalAhorro
        ahorroExistente={null}
        ingresoFijo={10000}
        disponibleParaPresupuestar={5000}
        onGuardar={onGuardar}
        onCerrar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByText('Ingresa un valor válido mayor a 0.')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('rechaza un porcentaje mayor a 100', () => {
    render(
      <ModalAhorro
        ahorroExistente={null}
        ingresoFijo={10000}
        disponibleParaPresupuestar={5000}
        onGuardar={vi.fn()}
        onCerrar={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Porcentaje'));
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '150' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('El porcentaje no puede ser mayor a 100.')).toBeInTheDocument();
  });

  it('guarda por monto y cierra el modal cuando es válido', () => {
    const onGuardar = vi.fn().mockReturnValue({ ok: true });
    const onCerrar = vi.fn();
    render(
      <ModalAhorro
        ahorroExistente={null}
        ingresoFijo={10000}
        disponibleParaPresupuestar={5000}
        onGuardar={onGuardar}
        onCerrar={onCerrar}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onGuardar).toHaveBeenCalledWith('monto', 1000);
    expect(onCerrar).toHaveBeenCalled();
  });

  it('precarga el modo y valor cuando ya existe un ahorro', () => {
    render(
      <ModalAhorro
        ahorroExistente={{ modo: 'porcentaje', valor: 10, monto: 1000, porcentaje: 10 }}
        ingresoFijo={10000}
        disponibleParaPresupuestar={5000}
        onGuardar={vi.fn()}
        onCerrar={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByText('Editar ahorro mensual')).toBeInTheDocument();
  });

  it('muestra el error devuelto por onGuardar sin cerrar el modal', () => {
    const onGuardar = vi.fn().mockReturnValue({ ok: false, error: 'No cabe en el disponible.' });
    const onCerrar = vi.fn();
    render(
      <ModalAhorro
        ahorroExistente={null}
        ingresoFijo={10000}
        disponibleParaPresupuestar={5000}
        onGuardar={onGuardar}
        onCerrar={onCerrar}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Guardar'));

    expect(screen.getByText('No cabe en el disponible.')).toBeInTheDocument();
    expect(onCerrar).not.toHaveBeenCalled();
  });
});
