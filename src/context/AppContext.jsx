import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import axiosInstance from "../services/axios.js";
import { createContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  // en AppContext
const [isAppLoading, setIsAppLoading] = useState(true);

useEffect(() => {
  checkBiometricSupport();
  checkStoredCredentials();
  const initializeApp = async () => {
    await checkBiometricSupport();

    // Primero: revisar token existente
    await checkStoredCredentials();

    // Segundo: intentar login biométrico (si hay credenciales)
    if (Platform.OS !== "web") {
      const stored = await SecureStore.getItemAsync("biometric_credentials");
      if (stored) {
        await loginWithBiometrics(); // internamente hace login()
      }
    }

    setIsAppLoading(false); // 💥 Ya estamos listos para renderizar la app
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

      // ✅ Validación para evitar crash en web
      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync("user_token", token);
        await SecureStore.setItemAsync(
          "biometric_credentials",
          JSON.stringify({ email, login_token })
        );
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
          console.log("Token inválido o expirado");
        }
      }
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync("user_token");
        await SecureStore.deleteItemAsync("biometric_credentials");
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
  };

  return (
    <AppContext.Provider value={functions}>{children}</AppContext.Provider>
  );
};

export { AppContext };