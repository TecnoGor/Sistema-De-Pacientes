import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      const response = await axios.get(`http://localhost:5000/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid && response.data.user) {
        setUser({
          id_usuario: response.data.user.id_usuario,
          nuser: response.data.user.nuser,
          rolid: response.data.user.rolid,
        });
        setIsAuthenticated(true);
      }
      return response.data.valid;
    } catch (error) {
      console.log("Error verificando el token: ", error);
      return false;
    }
  };

  // Función para iniciar sesión (sin navigate aquí)
  const login = async (token, userData) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
    // navigate se manejará en el componente que llama a login
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
        if (!isValid) {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Error al verificar token: ", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Función para cerrar sesión (sin navigate aquí)
  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout Error: ", error);
    } finally {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      // navigate se manejará en el componente que llama a logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook con verificación de seguridad
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
