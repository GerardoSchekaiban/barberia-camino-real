import { useState, createContext, useContext } from "react";
import { saveSession, clearSession, getBarber } from "../lib/auth";
import { login as apiLogin } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [barber, setBarber] = useState(() => getBarber());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, barber } = await apiLogin({ username, password });
      saveSession(token, barber);
      setBarber(barber);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    setBarber(null);
  };

  return (
    <AuthContext.Provider value={{ barber, loading, error, login, logout, isLoggedIn: !!barber }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
