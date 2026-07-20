import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen', () => {
  it('valida que se ingrese usuario y contraseña', () => {
    render(<LoginScreen onIniciarSesion={vi.fn()} onCrearCuenta={vi.fn()} />);

    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(screen.getByText('Ingresa tu usuario y contraseña.')).toBeInTheDocument();
  });

  it('valida el formato del usuario', () => {
    render(<LoginScreen onIniciarSesion={vi.fn()} onCrearCuenta={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'a' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(
      screen.getByText('El usuario debe tener 3-20 caracteres: letras, números o guion bajo.'),
    ).toBeInTheDocument();
  });

  it('llama a onIniciarSesion con el usuario y la contraseña en modo login', async () => {
    const onIniciarSesion = vi.fn().mockResolvedValue({ ok: true });
    render(<LoginScreen onIniciarSesion={onIniciarSesion} onCrearCuenta={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'ana' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByText('Iniciar sesión'));

    await vi.waitFor(() => expect(onIniciarSesion).toHaveBeenCalledWith('ana', 'clave123'));
  });

  it('cambia a modo "crear cuenta" y llama a onCrearCuenta', async () => {
    const onCrearCuenta = vi.fn().mockResolvedValue({ ok: true });
    render(<LoginScreen onIniciarSesion={vi.fn()} onCrearCuenta={onCrearCuenta} />);

    fireEvent.click(screen.getByText('¿No tienes cuenta? Créala aquí'));
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'ana_nueva' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave123' } });
    fireEvent.click(screen.getByText('Crear cuenta'));

    await vi.waitFor(() => expect(onCrearCuenta).toHaveBeenCalledWith('ana_nueva', 'clave123'));
    expect(await screen.findByText('Cuenta creada. Ya puedes iniciar sesión.')).toBeInTheDocument();
  });

  it('muestra el error devuelto por el callback', async () => {
    const onIniciarSesion = vi.fn().mockResolvedValue({ ok: false, error: 'Credenciales inválidas' });
    render(<LoginScreen onIniciarSesion={onIniciarSesion} onCrearCuenta={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('usuario'), { target: { value: 'ana' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'mala' } });
    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
