import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppContext } from '../context/AppContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithBiometrics, isBiometricAvailable } = useContext(AppContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    await login({ email, password });
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await loginWithBiometrics();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Autenticación fallida.');
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error con la autenticación biométrica.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar sesión
      </Button>

      {isBiometricAvailable && (
        <View style={styles.biometricContainer}>
          <Text style={{ marginBottom: 10 }}>O usa tu biometría</Text>
          <IconButton
            icon="fingerprint"
            size={36}
            onPress={handleBiometricAuth}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 25,
    textAlign: 'center',
  },
});

export default LoginScreen;
