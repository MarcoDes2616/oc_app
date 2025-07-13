import axiosInstance from './axios';

// Fetch all roles
export const fetchAllRoles = async () => {
  try {
    const response = await axiosInstance.get('/roles'); // Asegúrate de que la ruta es correcta
    return response.data; // Asumiendo que la API devuelve un arreglo de roles
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

// Fetch a role by ID
export const fetchRoleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/roles/${id}`); // Asegúrate de que la ruta es correcta
    return response.data; // Asumiendo que la API devuelve el rol correspondiente
  } catch (error) {
    console.error(`Error fetching role with ID ${id}:`, error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

// Create a new role
export const createRole = async (roleData) => {
  try {
    const response = await axiosInstance.post('/roles', roleData); // Asegúrate de que la ruta es correcta
    return response.data; // Asumiendo que la API devuelve el rol creado
  } catch (error) {
    console.error("Error creating role:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

// Update a role by ID
export const updateRole = async (id, roleData) => {
  try {
    const response = await axiosInstance.put(`/roles/${id}`, roleData); // Asegúrate de que la ruta es correcta
    return response.data; // Asumiendo que la API devuelve el rol actualizado
  } catch (error) {
    console.error(`Error updating role with ID ${id}:`, error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

// Delete a role by ID
export const deleteRole = async (id) => {
  try {
    await axiosInstance.delete(`/roles/${id}`); // Asegúrate de que la ruta es correcta
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};
