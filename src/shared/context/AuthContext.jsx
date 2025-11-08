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
                // Если access токен отсутствует, но есть refresh → обновляем
                let token = access;

                if (!token && refresh) {
                    token = await refreshToken(refresh);
                }

                // Загружаем профиль
                const profile = await getProfile();
                setUser(profile);
            } catch (err) {
                // токен невалиден → выходим
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
