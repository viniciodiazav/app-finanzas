import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('muestra el título por defecto, el mensaje, y llama a onConfirmar al aceptar', () => {
    const onConfirmar = vi.fn();
    render(<ConfirmDialog mensaje="¿Seguro?" onConfirmar={onConfirmar} onCancelar={vi.fn()} />);

    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Seguro?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onConfirmar).toHaveBeenCalled();
  });

  it('permite personalizar el título y el texto del botón de confirmar', () => {
    render(
      <ConfirmDialog
        titulo="Importar respaldo"
        mensaje="¿Reemplazar todo?"
        textoConfirmar="Importar y reemplazar"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );

    expect(screen.getByText('Importar respaldo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Importar y reemplazar' })).toBeInTheDocument();
  });

  it('llama a onCancelar al hacer click en Cancelar', () => {
    const onCancelar = vi.fn();
    render(<ConfirmDialog mensaje="¿Seguro?" onConfirmar={vi.fn()} onCancelar={onCancelar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancelar).toHaveBeenCalled();
  });
});
