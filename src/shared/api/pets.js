import { BACKEND_URL } from "config";
import { authFetch } from "./auth";

export async function getPet(id) {
  const url = `${BACKEND_URL}/pets/${id}/`;
  const res = await authFetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Не удалось загрузить питомца");
  }
  return res.json();
}

export async function createPet(formData) {
  const url = `${BACKEND_URL}/pets/`;
  const res = await authFetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Ошибка при добавлении питомца");
  }
  return res.json();
}

export async function updatePet(id, formData) {
  const url = `${BACKEND_URL}/pets/${id}/`;
  const res = await authFetch(url, { method: "PATCH", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Ошибка при обновлении питомца");
  }
  return res.json();
}

export async function deletePet(id) {
  const url = `${BACKEND_URL}/pets/${id}/`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Ошибка при удалении питомца");
  }
  return true;
}
