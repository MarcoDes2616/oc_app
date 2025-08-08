import axios from 'axios';
import { EXPO_PUBLIC_API_LOCAL, EXPO_PUBLIC_API_PROD } from '@env';
import authService from './authServices';

const axiosInstance = axios.create({
  baseURL: EXPO_PUBLIC_API_PROD,
  headers: {
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${authService.getCurrentUser()}`,
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && (error.response.status === 401)) {
      try {
        await authService.actionLogout();
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
      }
    } 
    return Promise.reject(error);
  }
);

export default axiosInstance;