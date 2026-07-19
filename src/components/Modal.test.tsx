import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('muestra el título y el contenido', () => {
    render(
      <Modal titulo="Mi modal" onCerrar={vi.fn()}>
        <p>Contenido</p>
      </Modal>
    );

    expect(screen.getByText('Mi modal')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('llama a onCerrar al hacer click en el botón de cerrar', () => {
    const onCerrar = vi.fn();
    render(
      <Modal titulo="Mi modal" onCerrar={onCerrar}>
        <p>Contenido</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCerrar).toHaveBeenCalled();
  });

  it('llama a onCerrar al hacer click en el fondo, pero no al hacer click dentro del contenido', () => {
    const onCerrar = vi.fn();
    render(
      <Modal titulo="Mi modal" onCerrar={onCerrar}>
        <p>Contenido</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('Contenido'));
    expect(onCerrar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Mi modal').closest('.fixed')!);
    expect(onCerrar).toHaveBeenCalled();
  });
});
