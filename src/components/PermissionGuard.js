import React from 'react';
import { useAuth } from '../context/AuthContext';
import PropTypes from "prop-types";

const PermissionGuard = ({ 
  children, 
  permission,
  any = [],
  all = [],
  fallback = null,
  hide = false,
  showIfNot = false
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = true;

  // Verificar permiso específico
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Verificar si tiene alguno de los permisos
  if (any.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(any);
  }

  // Verificar si tiene todos los permisos
  if (all.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(all);
  }

  if (showIfNot) {
    // Mostrar solo si NO tiene acceso
    return !hasAccess ? children : fallback;
  }

  // Mostrar solo si tiene acceso
  if (hide && !hasAccess) {
    return null;
  }

  return hasAccess ? children : fallback;
};

PermissionGuard.propTypes = {
    children: PropTypes.node.isRequired,
    permission: PropTypes.string,
    any: PropTypes.arrayOf(PropTypes.string),
    all: PropTypes.arrayOf(PropTypes.string),
    fallback: PropTypes.node,
    hide: PropTypes.bool,
    showIfNot: PropTypes.bool
  };
  
  PermissionGuard.defaultProps = {
    permission: '',
    any: [],
    all: [],
    fallback: null,
    hide: false,
    showIfNot: false
  };

export default PermissionGuard;