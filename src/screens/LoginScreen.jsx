import { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../services/axios.js';

const STORAGE_KEY = 'user_email';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, loginWithBiometrics } = useContext(AppContext);

  useEffect(() => {
    const init = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (err) {
        console.warn('No se pudo cargar el correo almacenado:', err);
      }

      const result = await loginWithBiometrics();
      if (result.success) {
        Alert.alert('Bienvenido', 'Autenticación biométrica exitosa.');
      } else if (result.error && result.error !== 'Falló la autenticación biométrica') {
        console.warn('Biometric login skipped:', result.error);
      }
    };

    init();
  }, []);

  const requestLoginToken = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/system/request_auth_token', { email: email.trim() });

      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEY, email.trim());
        setTokenRequested(true);
        Alert.alert('Éxito', 'Se ha enviado un token a tu correo.');
      } else {
        Alert.alert('Error', response.data.message || 'No se pudo solicitar el token.');
      }
    } catch (err) {
      console.error('Error solicitando token:', err);
      Alert.alert('Error', 'Ocurrió un error al solicitar el token.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !loginToken.trim()) {
      Alert.alert('Error', 'Debes completar ambos campos.');
      return;
    }

    try {
      setLoading(true);
      await AsyncStorage.setItem(STORAGE_KEY, email.trim());
      await login({ email: email.trim(), login_token: loginToken.trim() });
    } catch (err) {
      Alert.alert('Error', 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const resetLogin = async () => {
    setEmail('');
    setLoginToken('');
    setTokenRequested(false);
    setLoading(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {tokenRequested && (
        <IconButton
          icon="refresh"
          size={24}
          style={styles.resetIcon}
          onPress={resetLogin}
          accessibilityLabel="Reiniciar proceso de login"
        />
      )}

      <Text style={styles.title}>Autenticación por Token</Text>

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        disabled={tokenRequested}
      />

      {!tokenRequested ? (
        <>
          <Button
            mode="contained"
            onPress={requestLoginToken}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Solicitar token
          </Button>

          <Button
            mode="outlined"
            onPress={() => setTokenRequested(true)}
            disabled={loading || !email.trim()}
            style={styles.secondaryButton}
          >
            Ya tengo un token
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Token recibido por email"
            value={loginToken}
            onChangeText={setLoginToken}
            style={styles.input}
            keyboardType="default"
            autoCapitalize="none"
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Iniciar sesión
          </Button>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  secondaryButton: {
    marginTop: 10,
  },
  resetIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default LoginScreen;