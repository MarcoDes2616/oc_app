import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import axiosInstance from '../api/axios.js';
import { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkStoredCredentials();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(compatible && enrolled);
  };

  const login = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { token, userData } = response.data;
      setUser(userData);
      await SecureStore.setItemAsync('user_token', token);
      await SecureStore.setItemAsync('biometric_credentials', JSON.stringify({ email, password }));
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error de autenticación', 'Credenciales incorrectas');
    }
  };

  const loginWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica',
      fallbackLabel: 'Usar contraseña',
    });

    if (result.success) {
      const stored = await SecureStore.getItemAsync('biometric_credentials');
      if (stored) {
        const creds = JSON.parse(stored);
        await login(creds);
        return { success: true };
      } else {
        return { success: false, error: 'No hay credenciales almacenadas' };
      }
    } else {
      return { success: false, error: 'Falló la autenticación biométrica' };
    }
  };

  const checkStoredCredentials = async () => {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
      try {
        const response = await axiosInstance.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.log('Token inválido o expirado');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        loginWithBiometrics,
        isBiometricAvailable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
