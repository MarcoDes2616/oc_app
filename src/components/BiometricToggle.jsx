import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../context/AppContext';

const BiometricToggle = () => {
  const { isBiometricAvailable, user, credentials } = useContext(AppContext);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Verifica si ya hay credenciales guardadas
    const checkBiometricState = async () => {
      const stored = await SecureStore.getItemAsync('biometric_credentials');
      console.log('Stored biometric credentials:', stored);
      
      setEnabled(!!stored);
    };
    checkBiometricState();
  }, []);

  const toggleBiometric = async () => {
    if (enabled) {
      await SecureStore.deleteItemAsync('biometric_credentials');
      setEnabled(false);
    } else {
      if (user?.email) {
        const login_token = await SecureStore.getItemAsync('user_token');
        if (login_token) {
          await SecureStore.setItemAsync(
            'biometric_credentials',
            JSON.stringify(credentials)
          );
          setEnabled(true);
        }
      }
    }
  };

  if (!isBiometricAvailable) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
      <Text>Usar autenticación biométrica</Text>
      <Switch value={enabled} onValueChange={toggleBiometric} />
    </View>
  );
};

export default BiometricToggle;