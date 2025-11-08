import { BACKEND_URL } from "config";

export async function authFetch(url, options = {}) {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    const headers = {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...options.headers,
    };

    let res = await fetch(url, { ...options, headers });

    // Если access истёк → пробуем обновить
    if (res.status === 401 && refresh) {
        try {
            const newAccess = await refreshToken(refresh);

            if (!newAccess) {
                throw new Error("Ошибка обновления токена");
            }

            const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newAccess}`,
            };

            res = await fetch(url, { ...options, headers: retryHeaders });
        } catch {
            // refresh невалиден → очищаем токены и редиректим
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Редирект на /login
            window.location.href = "/login";
            return; // остановить выполнение
        }
    }

    // Если после повторного запроса всё ещё 401 → тоже редиректим
    if (res.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return;
    }

    return res;
}

export async function login(email, password) {
    const res = await fetch(`${BACKEND_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Неверный email или пароль");
    const data = await res.json();
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
}

export async function register({ username, email, first_name, last_name, password1, password2 }) {
    const res = await fetch(`${BACKEND_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, first_name, last_name, password1, password2 }),
    });

    if (!res.ok) {
        const errorData = await res.json(); // объект с полями ошибок
        throw errorData; // <- кидаем объект
    }

    const data = await res.json();
    if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
    }

    return data;
}

export async function refreshToken(refresh) {
    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null; // не кидаем ошибку, просто возвращаем null
    const data = await res.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
}

export async function logout() {
    // Удаляем токены из localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Здесь можно добавить запрос к API для инвалидации токена на сервере
    try {
        const token = localStorage.getItem("accessToken");
        if (token) {
            await fetch(`${BACKEND_URL}/auth/logout/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        }
    } catch (error) {
        console.error("Ошибка при выходе:", error);
    }
}
