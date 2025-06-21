// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext();
const TOKEN_KEY = "lms_auth_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug function to check token storage
  const checkTokenStorage = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const legacyToken = localStorage.getItem("token");

    console.log("🔍 Token check:");
    console.log(
      `- Current token (${TOKEN_KEY}):`,
      token ? "Present" : "Missing"
    );
    console.log(
      `- Legacy token ("token"):`,
      legacyToken ? "Present" : "Missing"
    );

    // Migrate legacy token if needed
    if (!token && legacyToken) {
      console.log("🔄 Migrating legacy token to new key format");
      localStorage.setItem(TOKEN_KEY, legacyToken);
      localStorage.removeItem("token");
      return legacyToken;
    }

    return token;
  };
  // Extract checkAuthStatus as a reusable function using useCallback
  const checkAuthStatus = useCallback(async () => {
    try {
      // Check and potentially migrate tokens
      const token = checkTokenStorage();

      if (!token) {
        console.warn("⚠️ No authentication token found");
        setUser(null);
        setLoading(false); // Immediately resolve loading if no token
        return;
      }

      // Get current user from backend using stored token
      console.log(
        "🔄 Fetching user data with token:",
        token.substring(0, 10) + "..."
      );

      // Force API to use the token we just verified exists
      api.setToken(token);

      const response = await api.get("/auth/me");
      console.log("📥 Auth check response:", response.data);

      if (response.data.user) {
        console.log("✅ User authenticated:", response.data.user.name);
        setUser(response.data.user);
      } else {
        console.warn("⚠️ No user data in response");
        setUser(null);
      }
    } catch (error) {
      // Token might be invalid or expired
      console.error("❌ Auth check failed:", error.message || error);
      if (error.response) {
        console.error(
          `Status: ${error.response.status}, message: ${
            error.response.data?.message || "No message"
          }`
        );
      }
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("token"); // Clear legacy token too
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is already logged in on app load
  useEffect(() => {
    console.log("🔄 Initial auth check on application load");
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Enhanced login function to handle tokens and user state
  const login = (userData) => {
    console.log("🔑 Login user:", userData?.name || "Unknown");

    // Verify token is in localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.warn("⚠️ Login called but no token in localStorage");
      // Try to check if there's a legacy token
      const legacyToken = localStorage.getItem("token");
      if (legacyToken) {
        console.log("🔄 Found legacy token during login, migrating...");
        localStorage.setItem(TOKEN_KEY, legacyToken);
        localStorage.removeItem("token");
      } else {
        console.error("❌ No token found during login!");
      }
    } else {
      console.log("✅ Token verified during login");
    }

    setUser(userData);
  };
  const logout = async () => {
    try {
      console.log("🔒 Logging out...");
      await api.post("/auth/logout");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      // Clear both token versions for safety
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("token"); // Clear legacy token too
      console.log("🔓 Tokens cleared from storage");
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
