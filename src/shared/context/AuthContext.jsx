import { createContext, useContext, useEffect, useState } from "react";
import { refreshToken } from "shared/api/auth";
import { getProfile } from "shared/api/profile";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");

      // Если нет токенов → не авторизован
      if (!access && !refresh) {
        setLoading(false);
        return;
      }

      try {
        let token = access;

        // Только если есть refresh → пробуем обновить
        if (!token && refresh) {
          token = await refreshToken(refresh);
        }

        // Если токен всё ещё недействителен → очистка
        if (!token) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
          setLoading(false);
          return;
        }

        // Загружаем профиль
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        console.error("Auth error:", err);

        // Очистка токенов и состояния
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, logout, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
