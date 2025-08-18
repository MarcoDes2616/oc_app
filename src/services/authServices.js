import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

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
  try {
    await SecureStore.deleteItemAsync("user_token");
  } catch (error) {
    return null;
  }
};

const clearAllSecureStorage = async () => {
  await SecureStore.deleteItemAsync("user_token");
  await SecureStore.deleteItemAsync("user_token");
};

const authService = {
  getCurrentUser,
  actionLogout,
  clearAllSecureStorage // Opcional
};

export default authService;