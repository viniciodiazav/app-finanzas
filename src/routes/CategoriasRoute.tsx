import { useNavigate } from 'react-router-dom';
import type { UseFinanzasReturn } from '../hooks/useFinanzas';
import { CategoriasScreen } from '../components/CategoriasScreen';

interface CategoriasRouteProps {
  finanzas: UseFinanzasReturn;
}

export function CategoriasRoute({ finanzas }: CategoriasRouteProps) {
  const navigate = useNavigate();
  const { categoriasConUso, editarCategoria, eliminarCategoria } = finanzas;

  return (
    <CategoriasScreen
      categorias={categoriasConUso}
      onVolver={() => navigate('/')}
      onEditar={editarCategoria}
      onEliminar={eliminarCategoria}
    />
  );
}
