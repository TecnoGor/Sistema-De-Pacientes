import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PropTypes from "prop-types";
// import { ApiOutlined } from "@mui/icons-material";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_Host = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    try {
      // 1. Verificar primero si el token está expirado localmente
      const decoded = jwtDecode(token);
      if (decoded.exp * 10000 < Date.now()) {
        return false;
      }

      // 2. Luego verificar con el backend
      const response = await axios.get(`${API_Host}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid && response.data.user) {
        // Guardamos la información del usuario
        setUser({
          codper: response.data.user.codper,
          firstname: response.data.user.firstname,
          rol: response.data.user.rol,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  // const login = async (credentials) => {
  //   try {
  //     const response = await axios.post("http://10.16.9.24:5001/login", credentials);
  //     const { token } = response.data;
  //     localStorage.setItem("authToken", token);
  //     const isValid = await verifyToken(token);

  //     if (!isValid) {
  //       throw new Error("Token inválido después de login");
  //     }

  //     setIsAuthenticated(true);
  //     return true;
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     localStorage.removeItem("authToken");
  //     return false;
  //   }
  // };

  const login = async (token, userData) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
    navigate("/dashboard");
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
      navigate("/authentication/sign-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login, // Asegúrate de incluir login aquí
        logout,
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
