import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import PermissionError from "components/PermissionError";
import PropTypes from "prop-types";

export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredAny = [],
  requiredAll = [],
  redirectTo = "/authentication/sign-in",
  moduleName = "",
}) => {
  const {
    isAuthenticated,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Cargando...</div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar si requiere un permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // En lugar de redirigir, mostrar mensaje de error
    return <PermissionError requiredPermission={requiredPermission} moduleName={moduleName} />;
  }

  // Verificar si requiere alguno de varios permisos
  if (requiredAny.length > 0 && !hasAnyPermission(requiredAny)) {
    const missing = requiredAny.filter((perm) => !permissions.includes(perm));
    return <PermissionError missingPermissions={missing} moduleName={moduleName} />;
  }

  // Verificar si requiere todos los permisos
  if (requiredAll.length > 0 && !hasAllPermissions(requiredAll)) {
    const missing = requiredAll.filter((perm) => !permissions.includes(perm));
    return <PermissionError missingPermissions={missing} moduleName={moduleName} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
  requiredAny: PropTypes.arrayOf(PropTypes.string),
  requiredAll: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
  moduleName: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredPermission: "",
  requiredAny: [],
  requiredAll: [],
  redirectTo: "/authentication/sign-in",
  moduleName: "",
};

export default ProtectedRoute;
