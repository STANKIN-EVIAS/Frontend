// shared/api/medicalCards.js
import { BACKEND_URL } from "config";
import { authFetch } from "./auth";

export async function getPetMedicalCard(petId) {
  try {
    const url = `${BACKEND_URL}/pets-documents/medical-cards/pet/${petId}/`;
    const res = await authFetch(url);
    return res.json();
  } catch (error) {
    if (error.res?.status === 404) {
      return null;
    }
    throw error;
  }
}

export const createMedicalCard = async (petId, data) => {
  const url = `${BACKEND_URL}/pets-documents/medical-cards/`;
  const res = await authFetch(url, { method: "POST", body: data });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail);
  }
  return res.json();
};

export const updateMedicalCard = async (id, data) => {
  const url = `${BACKEND_URL}/pets-documents/medical-cards/${id}/`;
  const res = await authFetch(url, { method: "PATCH", body: data });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail);
  }
  return res.json();
};

export const deleteMedicalCard = async (id) => {
  const url = `${BACKEND_URL}/pets-documents/medical-cards/${id}/`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail);
  }
  return true;
};
