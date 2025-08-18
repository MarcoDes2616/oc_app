import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import axiosInstance from "../services/axios.js";
import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { registerForPushNotifications } from "../utils/notifications.js";
import authService from "../services/authServices.js";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      await checkBiometricSupport();
      await checkStoredCredentials();

      if (Platform.OS !== "web") {
        const stored = await SecureStore.getItemAsync("biometric_credentials");
        if (stored) {
          await loginWithBiometrics();
        }
      }
      setIsAppLoading(false);
    };

    initializeApp();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(compatible && enrolled);
  };

  const enablePushNotifications = async () => {
    try {
      const pushToken = await registerForPushNotifications();

      if (pushToken) {
        await axiosInstance.post("/system/save-push-token", {
          userId: user.id,
          pushToken,
        });
      }
    } catch (error) {}
  };

  const login = async ({ email, login_token }) => {
    try {
      const response = await axiosInstance.post("/system/login", {
        email,
        login_token,
      });
      const { token, user } = response.data;
      setUser(user);

      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync("user_token", token);
        setCredentials({ email, login_token });
      }
      await enablePushNotifications();
    } catch (error) {
      throw error;
    }
  };

  const loginWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación biométrica",
      fallbackLabel: "Usar contraseña",
    });

    if (result.success) {
      if (Platform.OS !== "web") {
        const stored = await SecureStore.getItemAsync("biometric_credentials");

        if (stored) {
          const creds = JSON.parse(stored);
          await login(creds);
          return { success: true };
        } else {
          return { success: false, error: "No hay credenciales almacenadas" };
        }
      } else {
        return { success: false, error: "Biometría no disponible en web" };
      }
    } else {
      return { success: false, error: "Falló la autenticación biométrica" };
    }
  };

  const checkStoredCredentials = async () => {
    if (Platform.OS !== "web") {
      const token = await authService.getCurrentUser();
      if (token) {
        try {
          const { data } = await axiosInstance.get("system/me");
          setUser(data.user);
        } catch (error) {
          logout();
          await SecureStore.deleteItemAsync("biometric_credentials");
        }
      }
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/system/logout")
      await authService.actionLogout()
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const deletePushToken = async () => {
    try {
      const { data } = await axiosInstance.post("/system/delete-push-token");
      setUser(data.user);
    } catch (error) {
      console.error("Error deleting push token:", error);
      throw error;
    }
  };

  const functions = {
    user,
    login,
    loginWithBiometrics,
    isBiometricAvailable,
    logout,
    isAppLoading,
    credentials,
    deletePushToken,
    enablePushNotifications,
  };

  return (
    <AppContext.Provider value={functions}>{children}</AppContext.Provider>
  );
};

export { AppContext };
