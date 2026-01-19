import { useMemo } from 'react';
import { useAuth } from 'context/AuthContext';
import routes from 'routes';

export const useRoutesWithPermissions = () => {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  const filteredRoutes = useMemo(() => {
    if (!isAuthenticated || loading) {
      // Para usuarios no autenticados, mostrar solo rutas públicas
      return routes.filter(route => !route.protected && !route.requiredPermission);
    }
    
    // Para usuarios autenticados, filtrar por permisos
    return routes.filter(route => {
      // Si es ruta pública o no protegida, mostrar
      if (!route.protected) return true;
      
      // Si requiere permiso específico, verificar
      if (route.requiredPermission) {
        return hasPermission(route.requiredPermission);
      }
      
      // Si no requiere permiso específico pero está protegida, mostrar
      return true;
    });
  }, [isAuthenticated, loading, hasPermission]);

  return filteredRoutes;
};