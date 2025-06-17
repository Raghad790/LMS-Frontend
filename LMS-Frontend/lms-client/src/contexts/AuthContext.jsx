// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token means not authenticated
        setUser(null);
        setLoading(false);
        return;
      }

      // Use token to get current user
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user || response.data.data);
      } else {
        // Invalid token or other issue
        localStorage.removeItem('token');
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.log("Auth check failed:", err);
      // Clear invalid token
      localStorage.removeItem('token');
      setUser(null);
      
      // Only set error if it's not a 401
      if (err.response && err.response.status !== 401) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Set authenticated user
  const login = (userData) => {
    if (userData) {
      setUser(userData);
      setError(null);
    }
  };

  // Register a new user (just a convenience wrapper)
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Still remove token and user on logout error
      localStorage.removeItem('token');
      setUser(null);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;