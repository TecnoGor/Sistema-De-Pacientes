import React, { createContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      }
      return true;
    } catch (error) {
      console.log("Error verificando el token: ", error);
      return false;
    }
  };
  // Función para iniciar sesión
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
        if (!isValid) {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.log("Error al verificar token: ", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  // Función para cerrar sesión
  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Logout Error: ", error);
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
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
