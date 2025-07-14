import axios from "axios";
import authService from "./authServices";

const BASE_URL = import.meta.env.VITE_APP_API_PROD

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})
axiosInstance.interceptors.request.use((config) => {
    config.headers = {Authorization : "Bearer " + authService.getCurrentUser()}
    return config;
});

axiosInstance.interceptors.response.use((response) => {
    return response;
})
export default axiosInstance;