import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('muestra la etiqueta y el valor', () => {
    render(<StatTile etiqueta="Ingreso total" valor="$1,000.00" />);

    expect(screen.getByText('Ingreso total')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('aplica la clase de color personalizada cuando se provee', () => {
    render(<StatTile etiqueta="Total gastado" valor="$50.00" valorClassName="text-red-600" />);

    expect(screen.getByText('$50.00').className).toMatch(/text-red-600/);
  });
});
