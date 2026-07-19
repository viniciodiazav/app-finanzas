import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModoValorToggle } from './ModoValorToggle';

describe('ModoValorToggle', () => {
  it('llama a onCambiar con el modo correspondiente al hacer click', () => {
    const onCambiar = vi.fn();
    render(<ModoValorToggle modo="monto" onCambiar={onCambiar} />);

    fireEvent.click(screen.getByText('Porcentaje'));
    expect(onCambiar).toHaveBeenCalledWith('porcentaje');

    fireEvent.click(screen.getByText('Monto'));
    expect(onCambiar).toHaveBeenCalledWith('monto');
  });

  it('resalta el botón activo según el modo actual', () => {
    render(<ModoValorToggle modo="porcentaje" onCambiar={vi.fn()} />);

    expect(screen.getByText('Porcentaje').className).toMatch(/bg-brand-600/);
    expect(screen.getByText('Monto').className).not.toMatch(/bg-brand-600/);
  });
});
