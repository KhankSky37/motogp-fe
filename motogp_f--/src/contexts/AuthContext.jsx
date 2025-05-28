import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AuthService from "../services/AuthService";

// Tạo context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo từ token trong localStorage (nếu có)
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("motogp_token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser({
              id: decodedToken.userId,
              email: decodedToken.sub,
              role: decodedToken.role,
            });
          }
        } catch (error) {
          console.error("Invalid token:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    const token = response.data;

    if (token && typeof token === "string") {
      localStorage.setItem("motogp_token", token);

      const decodedToken = jwtDecode(token);

      const userData = {
        id: decodedToken.userId,
        email: decodedToken.sub,
        role: decodedToken.role,
      };

      setUser(userData);
      return userData;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("motogp_token");
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;