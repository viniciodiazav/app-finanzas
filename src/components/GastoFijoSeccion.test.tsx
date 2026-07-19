import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GastoFijoSeccion } from './GastoFijoSeccion';

describe('GastoFijoSeccion', () => {
  it('llama a onAgregarGastoFijo al hacer click', () => {
    const onAgregarGastoFijo = vi.fn();
    render(<GastoFijoSeccion onAgregarGastoFijo={onAgregarGastoFijo} />);

    fireEvent.click(screen.getByText('+ Agregar gasto fijo'));
    expect(onAgregarGastoFijo).toHaveBeenCalled();
  });
});
