import axiosInstance from './axios';

// Fetch all guests
export const fetchAllGuests = async () => {
  try {
    const {data} = await axiosInstance.get('/guest');
    return data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw error;
  }
};

// Fetch a single guest by ID
export const fetchGuestById = async (id) => {
  try {
    const response = await axiosInstance.get(`/guest/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching guest with ID ${id}:`, error);
    throw error;
  }
};

// Create a new guest
export const createGuest = async (guestData) => {
  try {
    const response = await axiosInstance.post('/guest', guestData);
    return response.data;
  } catch (error) {
    console.error('Error creating guest:', error);
    throw error;
  }
};

// Update guest by ID
export const updateGuest = async (id, guestData) => {
  try {
    const response = await axiosInstance.put(`/guest/${id}`, guestData);
    return response.data;
  } catch (error) {
    console.error(`Error updating guest with ID ${id}:`, error);
    throw error;
  }
};

// Delete guest by ID
export const deleteGuest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/guest/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting guest with ID ${id}:`, error);
    throw error;
  }
};

// Send invitation to guest
export const sendInvitation = async (id) => {
  try {
    const response = await axiosInstance.post(`/guest/send_invitation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error sending invitation to guest with ID ${id}:`, error);
    throw error;
  }
};

