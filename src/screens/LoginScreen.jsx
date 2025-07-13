import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AppContext);

  const requestLoginToken = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/request-token', { email });
      if (response.data.success) {
        setTokenRequested(true);
        Alert.alert('Éxito', 'Se ha enviado un token a tu correo.');
      } else {
        Alert.alert('Error', response.data.message || 'No se pudo solicitar el token.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un error al solicitar el token.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !loginToken) {
      Alert.alert('Error', 'Debes completar ambos campos.');
      return;
    }

    await login({ email, login_token: loginToken });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autenticación por Token</Text>

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {!tokenRequested ? (
        <Button
          mode="contained"
          onPress={requestLoginToken}
          loading={loading}
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
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Iniciar sesión
          </Button>
        </>
      )}
    </View>
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
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default LoginScreen;
