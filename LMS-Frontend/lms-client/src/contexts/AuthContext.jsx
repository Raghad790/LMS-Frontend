import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { logoutAndRedirect } from "../utils/logoutHandler";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => setUser(userData);

  // ✅ useCallback to prevent warning
  const logout = useCallback(async () => {
    if (!user) return;
    await logoutAndRedirect();
    setUser(null);
  }, [user]);

  // ✅ Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user || res.data.data);
      } catch (err) {
        console.error("Session restore failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // 🔁 Refresh token every 10 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return;
      try {
        await api.post("/auth/refresh-token");
      } catch (err) {
        console.warn("Token refresh failed", err);
        logout();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, logout]);

  // 🔁 Check session every 5 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user || null);
      } catch (err) {
        console.warn("Session check failed", err);
        logout();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, logout]);

  // ⏳ Inactivity logout after 15 mins
  useEffect(() => {
    const limit = 15 * 60 * 1000;
    let lastActivity = Date.now();

    const update = () => (lastActivity = Date.now());

    const check = setInterval(() => {
      if (user && Date.now() - lastActivity > limit) logout();
    }, 60 * 1000);

    window.addEventListener("mousemove", update);
    window.addEventListener("keydown", update);

    return () => {
      clearInterval(check);
      window.removeEventListener("mousemove", update);
      window.removeEventListener("keydown", update);
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
