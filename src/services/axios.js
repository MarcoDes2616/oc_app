import axios from 'axios';
import { EXPO_PUBLIC_API_LOCAL, EXPO_PUBLIC_API_PROD } from '@env';
import authService from './authServices';

const axiosInstance = axios.create({
  baseURL: EXPO_PUBLIC_API_PROD,
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await authService.getCurrentUser();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
); 

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