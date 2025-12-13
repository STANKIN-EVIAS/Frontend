// shared/api/medicalCards.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

export const getPetMedicalCard = async (petId) => {
  try {
    // Используем ваш кастомный action
    const endpoint = `/api/medical-cards/pet/${petId}/`;
    console.log(`Запрашиваем медкарту: ${API_URL}${endpoint}`);
    
    const response = await axios.get(`${API_URL}${endpoint}`, {
      withCredentials: true,
      // Не бросать ошибку при 404
      validateStatus: function (status) {
        return status >= 200 && status < 300 || status === 404;
      }
    });
    
    console.log('Статус ответа:', response.status);
    console.log('Данные ответа:', response.data);
    
    if (response.status === 404) {
      console.log('Медкарта не найдена (404)');
      return null;
    }
    
    return response.data;
    
  } catch (error) {
    console.error('Ошибка загрузки медицинской карты:', error);
    
    // Если это 404 ошибка, возвращаем null
    if (error.response?.status === 404) {
      return null;
    }
    
    // Другие ошибки
    throw error;
  }
};