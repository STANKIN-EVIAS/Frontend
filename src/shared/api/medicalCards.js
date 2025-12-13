// shared/api/medicalCards.js
import axios from "axios";
import { BACKEND_URL } from "config";

export const getPetMedicalCard = async (petId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/pets-documents/medical-cards/pet/${petId}/`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createMedicalCard = async (petId, data) => {
  const response = await axios.get(`${BACKEND_URL}/pets-documents/medical-cards`, {
    ...data,
    pet: petId,
  });
  return response.data;
};

export const updateMedicalCard = async (id, data) => {
  const response = await axios.get(`${BACKEND_URL}/pets-documents/medical-cards/${id}/`, data);
  return response.data;
};

export const deleteMedicalCard = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/pets-documents/medical-cards/${id}/`);
  return response.data;
};
