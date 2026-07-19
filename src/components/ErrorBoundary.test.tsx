import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function ComponenteQueTruena(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renderiza a los hijos normalmente cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <p>Todo bien</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });

  it('muestra la pantalla de error cuando un hijo lanza una excepción', () => {
    render(
      <ErrorBoundary>
        <ComponenteQueTruena />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
  });

  it('el botón de volver al inicio redirige a la raíz', () => {
    const originalLocation = window.location;
    const assignSpy = vi.fn();
    // jsdom no permite espiar location.assign directamente (propiedad no configurable).
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign: assignSpy },
    });

    render(
      <ErrorBoundary>
        <ComponenteQueTruena />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Volver al inicio'));
    expect(assignSpy).toHaveBeenCalledWith('/');

    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });
});
