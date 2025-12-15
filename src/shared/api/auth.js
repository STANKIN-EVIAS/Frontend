import { BACKEND_URL } from "config";

export async function authFetch(url, options = {}) {
  const access = localStorage.getItem("accessToken");
  const refresh = localStorage.getItem("refreshToken");

  // Определяем, FormData ли тело запроса
  const isFormData = options.body instanceof FormData;

  const headers = {
    // Только если не FormData
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...options.headers,
  };

  let res = await fetch(url, { ...options, headers });

  // Если access истёк → пробуем обновить
  if (res.status === 401 && refresh) {
    try {
      const newAccess = await refreshToken(refresh);
      if (!newAccess) throw new Error("Ошибка обновления токена");

      const retryHeaders = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${newAccess}`,
        ...options.headers,
      };

      res = await fetch(url, { ...options, headers: retryHeaders });
    } catch (err) {
      console.warn("❌ Ошибка при обновлении токена:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => (window.location.href = "/login"), 50);
      return Promise.reject(err);
    }
  }

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setTimeout(() => (window.location.href = "/login"), 50);
    return Promise.reject(new Error("Неавторизованн"));
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

  const data = await res.json();

  if (!res.ok) {
    throw data; // кидаем объект с ошибками
  }

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

  if (!res.ok) throw new Error("Не удалось обновить токен");

  const data = await res.json();

  // Сохраняем новый токен
  localStorage.setItem("accessToken", data.access);
  if (data.refresh) localStorage.setItem("refreshToken", data.refresh);

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
