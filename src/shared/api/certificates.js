// shared/api/medicalCards.js
import { BACKEND_URL } from "config";
import { authFetch } from "./auth";

export async function getPetCertificates(petId) {
  try {
    const url = `${BACKEND_URL}/pets-documents/certificates/pet/${petId}/`;
    const res = await authFetch(url);
    return res.json();
  } catch (error) {
    if (error.res?.status === 404) {
      return null;
    }
    throw error;
  }
}
