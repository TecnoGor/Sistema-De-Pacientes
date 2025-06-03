
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                // Aquí podrías verificar si el token ha expirado
                setIsAuthenticated(true);
            }
        };
        checkToken();
    }, []);

    // Función para iniciar sesión
    const login = async (token) => {
        await AsyncStorage.setItem("authToken", token);
        setIsAuthenticated(true);
    };

    // Función para cerrar sesión
    const logout = async () => {
        await AsyncStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};