/**
 * Archivo de utilidades para manejar permisos
 */

// Mapeo de permisos a nombres legibles
export const permissionLabels = {
    "view_dashboard": "Ver Dashboard",
    "view_pacientes": "Ver Pacientes",
    "create_pacientes": "Crear Pacientes",
    "edit_pacientes": "Editar Pacientes",
    "delete_pacientes": "Eliminar Pacientes",
    "view_consultas": "Ver Consultas",
    "create_consultas": "Crear Consultas",
    "edit_consultas": "Editar Consultas",
    "view_citas": "Ver Citas",
    "create_citas": "Crear Citas",
    "edit_citas": "Editar Citas",
    "view_especialistas": "Ver Especialistas",
    "create_especialistas": "Crear Especialistas",
    "edit_especialistas": "Editar Especialistas",
    "view_usuarios": "Ver Usuarios",
    "create_usuarios": "Crear Usuarios",
    "edit_usuarios": "Editar Usuarios",
    "view_roles": "Ver Roles",
    "edit_roles": "Editar Roles",
    "admin_system": "Administrador del Sistema"
  };
  
  // Grupos de permisos por módulo
  export const permissionGroups = {
    dashboard: ["view_dashboard"],
    pacientes: ["view_pacientes", "create_pacientes", "edit_pacientes", "delete_pacientes"],
    consultas: ["view_consultas", "create_consultas", "edit_consultas"],
    citas: ["view_citas", "create_citas", "edit_citas"],
    especialistas: ["view_especialistas", "create_especialistas", "edit_especialistas"],
    usuarios: ["view_usuarios", "create_usuarios", "edit_usuarios"],
    roles: ["view_roles", "edit_roles"],
    administracion: ["admin_system"]
  };
  
  // Función para obtener permisos por módulo
  export const getPermissionsByModule = (moduleName) => {
    return permissionGroups[moduleName] || [];
  };
  
  // Función para verificar si tiene permisos para un módulo completo
  export const hasModuleAccess = (permissions, moduleName) => {
    const modulePermissions = getPermissionsByModule(moduleName);
    if (modulePermissions.length === 0) return false;
    
    // Para acceso básico, solo necesita el permiso de view
    const viewPermission = `view_${moduleName}`;
    return permissions.includes(viewPermission) || permissions.includes("admin_system");
  };
  
  // Función para obtener permisos faltantes
  export const getMissingPermissions = (userPermissions, requiredPermissions) => {
    return requiredPermissions.filter(perm => !userPermissions.includes(perm));
  };