import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen', () => {
  it('valida que se ingrese correo y contraseña', () => {
    render(<LoginScreen onIniciarSesion={vi.fn()} onCrearCuenta={vi.fn()} />);

    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(screen.getByText('Ingresa tu correo y contraseña.')).toBeInTheDocument();
  });

  it('llama a onIniciarSesion con el correo y la contraseña en modo login', async () => {
    const onIniciarSesion = vi.fn().mockResolvedValue({ ok: true });
    render(<LoginScreen onIniciarSesion={onIniciarSesion} onCrearCuenta={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByText('Iniciar sesión'));

    await vi.waitFor(() => expect(onIniciarSesion).toHaveBeenCalledWith('a@b.com', 'clave123'));
  });

  it('cambia a modo "crear cuenta" y llama a onCrearCuenta', async () => {
    const onCrearCuenta = vi.fn().mockResolvedValue({ ok: true });
    render(<LoginScreen onIniciarSesion={vi.fn()} onCrearCuenta={onCrearCuenta} />);

    fireEvent.click(screen.getByText('¿No tienes cuenta? Créala aquí'));
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'nuevo@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByText('Crear cuenta'));

    await vi.waitFor(() => expect(onCrearCuenta).toHaveBeenCalledWith('nuevo@b.com', 'clave123'));
    expect(await screen.findByText('Cuenta creada. Ya puedes iniciar sesión.')).toBeInTheDocument();
  });

  it('muestra el error devuelto por el callback', async () => {
    const onIniciarSesion = vi.fn().mockResolvedValue({ ok: false, error: 'Credenciales inválidas' });
    render(<LoginScreen onIniciarSesion={onIniciarSesion} onCrearCuenta={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'mala' } });
    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
