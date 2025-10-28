import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "shared/api/profile";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const token = localStorage.getItem("accessToken");

    // Если токен есть — сразу авторизован
    const [user, setUser] = useState(token ? { image: null } : null);
    const [loading, setLoading] = useState(!!token);

    useEffect(() => {
        if (!token) return;

        getProfile()
            .then((data) => setUser(data))
            .catch(() => {
                localStorage.removeItem("accessToken");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
