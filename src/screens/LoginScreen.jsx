import { useState, useContext, useEffect } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../services/axios.js';
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from 'expo-local-authentication';

const STORAGE_KEY = 'user_email';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [activeSessionInfo, setActiveSessionInfo] = useState(null);

  const { login, loginWithBiometrics } = useContext(AppContext);

  useEffect(() => {
    const init = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedEmail) {
          setEmail(storedEmail);
        }

        // Verificar si hay credenciales biométricas guardadas
        const stored = await SecureStore.getItemAsync("biometric_credentials");
        setIsBiometricAvailable(!!stored);

        // Solo intentar autenticación biométrica si hay credenciales almacenadas
        if (stored) {
          const biometricAuth = await LocalAuthentication.hasHardwareAsync() && 
                              await LocalAuthentication.isEnrolledAsync();
          
          if (biometricAuth) {
            const result = await loginWithBiometrics();
            if (result.success) {
              Alert.alert('Bienvenido', 'Autenticación biométrica exitosa.');
            } else if (result.error) {
              console.log('Autenticación biométrica fallida o cancelada:', result.error);
            }
          }
        }
      } catch (err) {
        console.warn('Error en inicialización:', err);
      }
    };

    init();
  }, []);

  const handleBiometricLogin = async () => {
    if (!isBiometricAvailable) return;
    try {
      setLoading(true);
      const result = await loginWithBiometrics();
      if (result.success) {
        Alert.alert('Bienvenido', 'Autenticación biométrica exitosa.');
      } else {
        Alert.alert('Autenticación fallida', result.error || 'No se pudo completar la autenticación biométrica');
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      Alert.alert('Error', 'Ocurrió un problema con la autenticación biométrica');
    } finally {
      setLoading(false);
    }
  };

   const requestLoginToken = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/system/request_auth_token', { email: email.trim() });

      if (response.status === 403 && response.data.code === 'SESSION_ACTIVE') {
        // Hay una sesión activa, mostramos la información
        setActiveSessionInfo({
          lastLogin: response.data.session.last_login,
          message: response.data.message
        });
        return;
      }

      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEY, email.trim());
        setTokenRequested(true);
        Alert.alert('Éxito', 'Se ha enviado un token a tu correo.');
      } else {
        Alert.alert('Error', response.data.message || 'No se pudo solicitar el token.');
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.code === 'SESSION_INACTIVE') {
        setActiveSessionInfo({
          lastLogin: err.response.data.session.last_login,
          message: err.response.data.message
        });
      } else {
        console.error('Error solicitando token:', err);
        Alert.alert('Error', 'Ocurrió un error al solicitar el token.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    Alert.alert(
      'Cerrar sesión activa',
      '¿Estás seguro que deseas cerrar la sesión activa e iniciar una nueva?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        { 
          text: 'Sí, continuar', 
          onPress: async () => {
            try {
              setLoading(true);
              // Enviamos un parámetro especial para forzar el login
              const response = await axiosInstance.post('/system/request_auth_token', { 
                email: email.trim(),
                force_login: true
              });
              
              if (response.data.success) {
                await AsyncStorage.setItem(STORAGE_KEY, email.trim());
                setTokenRequested(true);
                setActiveSessionInfo(null);
                Alert.alert('Éxito', 'Se ha enviado un token a tu correo.');
              }
            } catch (error) {
              console.error('Error forzando login:', error);
              Alert.alert('Error', 'No se pudo forzar el inicio de sesión.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogin = async () => {
  if (!email.trim() || !loginToken.trim()) {
    Alert.alert('Error', 'Debes completar ambos campos.');
    return;
  }
  try {
    setLoading(true);
    await AsyncStorage.setItem(STORAGE_KEY, email.trim());
    
    await login({ 
      email: email.trim(), 
      login_token: loginToken.trim() 
    });
    setActiveSessionInfo(null);

  } catch (err) {
    if (err.response?.status === 403 && err.response?.data?.code === 'SESSION_INACTIVE') {
      setActiveSessionInfo({
        lastLogin: err.response.data.session.last_login,
        message: err.response.data.message
      });
    } else {
      Alert.alert(
        'Error', 
        err.response?.data?.message || 'No se pudo iniciar sesión.'
      );
    }
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
        //   Icono de autenticación biométrica
    {isBiometricAvailable && <IconButton
       icon="fingerprint"
       size={24}
       style={styles.biometricIcon}
       onPress={handleBiometricLogin}
       disabled={loading}
       accessibilityLabel="Autenticación biométrica"
     />}

     {/* Icono de reinicio (existente) */}
     {tokenRequested && (
       <IconButton
         icon="refresh"
         size={24}
         style={styles.resetIcon}
         onPress={resetLogin}
         disabled={loading}
         accessibilityLabel="Reiniciar proceso de login"
       />
     )}

     <Text style={styles.title}>Autenticación por Token</Text>

      {activeSessionInfo ? (
        <View style={styles.sessionWarningContainer}>
          <Text style={styles.warningTitle}>¡Sesión activa detectada!</Text>
          
          <Text style={styles.warningText}>
            Hay una sesión iniciada el {activeSessionInfo.lastLogin}.
          </Text>          
          <Text style={styles.securityWarning}>
            Por seguridad, solo puedes tener una sesión activa a la vez.
          </Text>
          
          <Text style={styles.securityAdvice}>
            Si no reconoces esta actividad, cambia tu contraseña inmediatamente.
          </Text>
          
          <Button 
            mode="contained" 
            onPress={handleForceLogin}
            style={styles.forceLoginButton}
            labelStyle={styles.forceLoginButtonLabel}
          >
            Cerrar sesión anterior e iniciar nueva
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => setActiveSessionInfo(null)}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </View>
      ) : (
        <>
          {/* Tu formulario de login existente */}
          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            disabled={tokenRequested || loading}
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
                disabled={loading}
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
  biometricIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  sessionWarningContainer: {
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffd54f'
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 10,
    textAlign: 'center'
  },
  warningText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  securityWarning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 15,
    marginBottom: 5
  },
  securityAdvice: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20
  },
  forceLoginButton: {
    backgroundColor: '#d32f2f',
    marginTop: 10
  },
  forceLoginButtonLabel: {
    color: 'white'
  },
  cancelButton: {
    marginTop: 10,
    borderColor: '#757575'
  }
});

export default LoginScreen;