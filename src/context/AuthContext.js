import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_Host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Función para obtener permisos desde el backend
  const fetchUserPermissions = async (userId, roleId) => {
    try {
      const response = await axios.get(`${API_Host}/user-permissions`, {
        params: { user_id: userId, role_id: roleId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data.success) {
        return response.data.permissions;
      }
      return [];
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  };

  const verifyToken = async (token) => {
    try {
      // 1. Verificar si el token está expirado localmente
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      // 2. Verificar con el backend y obtener permisos
      const response = await axios.get(`${API_Host}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid && response.data.user) {
        // Guardar información del usuario
        const userData = {
          codper: response.data.user.codper,
          firstname: response.data.user.firstname,
          rol: response.data.user.rol,
          role_id: response.data.user.role_id,
          id_usuario: response.data.user.id_usuario,
        };

        setUser(userData);

        // Obtener permisos del usuario
        if (userData.id_usuario && userData.role_id) {
          const userPermissions = await fetchUserPermissions(userData.id_usuario, userData.role_id);
          setPermissions(userPermissions);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  const login = async (token, userData) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(userData);

    // Obtener permisos después del login
    if (userData.id_usuario && userData.role_id) {
      const userPermissions = await fetchUserPermissions(userData.id_usuario, userData.role_id);
      setPermissions(userPermissions);
    }

    setLoading(false);
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      await axios.post(`${API_Host}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      setPermissions([]);
      navigate("/authentication/sign-in");
    }
  };

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName);
  };

  // Función para verificar si el usuario tiene al menos uno de los permisos
  const hasAnyPermission = (permissionNames) => {
    return permissionNames.some((permission) => permissions.includes(permission));
  };

  // Función para verificar si el usuario tiene todos los permisos
  const hasAllPermissions = (permissionNames) => {
    return permissionNames.every((permission) => permissions.includes(permission));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const isValid = await verifyToken(token);
        setIsAuthenticated(isValid);

        if (!isValid) {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        permissions,
        loading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
