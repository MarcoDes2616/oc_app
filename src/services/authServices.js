import * as SecureStore from "expo-secure-store";

const getCurrentUser = async () => {
  try {
    const token = await SecureStore.getItemAsync("user_token");
    return token;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

const actionLogout = async () => {
  await SecureStore.deleteItemAsync("user_token");
  if (window.location) {
    window.location.reload();
  }
};

const clearAllSecureStorage = async () => {
  await SecureStore.deleteItemAsync("user_token");
};

const authService = {
  getCurrentUser,
  actionLogout,
  clearAllSecureStorage // Opcional
};

export default authService;