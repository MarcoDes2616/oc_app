import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import axiosInstance from "../services/axios.js";
import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { registerForPushNotifications } from "../utils/notifications.js";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
      const pushToken = await registerForPushNotifications();
      if (pushToken) {
        await axiosInstance.post("/system/save-push-token", {
          userId: user.id,
          pushToken,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error de autenticación", "Token inválido o expirado.");
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
      const token = await SecureStore.getItemAsync("user_token");
      if (token) {
        try {
          const response = await axiosInstance.get("system/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          logout();
          await SecureStore.deleteItemAsync("biometric_credentials");
        }
      }
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync("user_token");
      }
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
  };

  return (
    <AppContext.Provider value={functions}>{children}</AppContext.Provider>
  );
};

export { AppContext };
