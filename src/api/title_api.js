import axiosInstance from './axios';

// Fetch all roles
export const fetchAllTitles = async () => {
  try {
    const response = await axiosInstance.get('/title'); // Asegúrate de que la ruta es correcta
    return response.data; // Asumiendo que la API devuelve un arreglo de roles
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};