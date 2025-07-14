import axios from 'axios';
import { EXPO_PUBLIC_API_LOCAL, EXPO_PUBLIC_API_PROD } from '@env';

const axiosInstance = axios.create({
  baseURL: EXPO_PUBLIC_API_PROD,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes añadir interceptores aquí si necesitas manejar errores o respuestas globalmente
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
