import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error no controlado en la aplicación:', error, errorInfo);
  }

  private volverAlInicio = () => {
    this.setState({ error: null });
    window.location.assign('/');
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <h1 className="text-lg font-bold text-slate-800 mb-2">Algo salió mal</h1>
            <p className="text-sm text-slate-500 mb-4">
              Ocurrió un error inesperado. Tus datos guardados no se pierden.
            </p>
            <button
              onClick={this.volverAlInicio}
              className="w-full py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
