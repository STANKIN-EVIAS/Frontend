import axios from "axios";
import { BACKEND_URL } from "config";
import { authFetch } from "./auth";

export const getClinics = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/vet-clinics/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClinicById = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/vet-clinics/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClinicServices = async (clinicId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/vet-clinics/${clinicId}/appointments/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClinicAppointments = async (clinicId) => {
  try {
    const url = clinicId
      ? `${BACKEND_URL}/vet-clinics/appointments/?clinic_id=${clinicId}`
      : `${BACKEND_URL}/vet-clinics/appointments/`;
    const res = await authFetch(url);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Не удалось загрузить приёмы клиники");
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};
