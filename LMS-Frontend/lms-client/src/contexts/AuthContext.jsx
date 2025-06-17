import { createContext, useState, useEffect } from "react";
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, role }
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const restoreSession = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch (err) {
      console.error('Session restore failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  restoreSession();
}, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // optionally: axios.post('/logout', ...)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext ;