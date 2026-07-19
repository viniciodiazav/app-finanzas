import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BackupBar } from './BackupBar';

describe('BackupBar', () => {
  it('llama a onExportar al hacer click en exportar', () => {
    const onExportar = vi.fn();
    render(<BackupBar onExportar={onExportar} onImportar={vi.fn()} />);

    fireEvent.click(screen.getByText('Exportar respaldo'));
    expect(onExportar).toHaveBeenCalled();
  });

  it('pide confirmación antes de importar y no llama a onImportar hasta confirmar', () => {
    const onImportar = vi.fn();
    const { container } = render(<BackupBar onExportar={vi.fn()} onImportar={onImportar} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const archivo = new File(['{}'], 'respaldo.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [archivo] } });

    expect(screen.getByText(/respaldo\.json/)).toBeInTheDocument();
    expect(onImportar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Importar y reemplazar' }));
    expect(onImportar).toHaveBeenCalledWith(archivo);
  });

  it('no llama a onImportar si se cancela la confirmación', () => {
    const onImportar = vi.fn();
    const { container } = render(<BackupBar onExportar={vi.fn()} onImportar={onImportar} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const archivo = new File(['{}'], 'respaldo.json', { type: 'application/json' });
    fireEvent.change(input, { target: { files: [archivo] } });

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onImportar).not.toHaveBeenCalled();
    expect(screen.queryByText(/respaldo\.json/)).not.toBeInTheDocument();
  });
});
