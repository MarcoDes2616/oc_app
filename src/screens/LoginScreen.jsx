import { useState, useContext } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../services/axios.js';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AppContext);

  const requestLoginToken = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/system/request_auth_token', { email: email.trim() });
      
      if (response.data.success) {
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
      await login({ email: email.trim(), login_token: loginToken.trim() });
    } catch (err) {
      Alert.alert('Error', 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
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
        <Button
          mode="contained"
          onPress={requestLoginToken}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Solicitar token
        </Button>
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
});

export default LoginScreen;