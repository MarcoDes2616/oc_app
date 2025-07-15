import React, { useContext, useEffect, useState } from "react";
import { View, Text, Switch, Platform, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AppContext } from "../context/AppContext";

const BiometricToggle = () => {
  const { isBiometricAvailable, user } = useContext(AppContext);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    checkStored();
  }, [user]); // también se actualiza cuando cambia el usuario

  const checkStored = async () => {
    if (Platform.OS !== "web") {
      const stored = await SecureStore.getItemAsync("biometric_credentials");
      setEnabled(!!stored);
    }
  };

  const toggleBiometrics = async () => {
    if (!user) {
      Alert.alert(
        "Inicia sesión primero",
        "Necesitas estar autenticado para activar la biometría."
      );
      return;
    }

    if (!enabled) {
      // Modal de confirmación al activar
      Alert.alert(
        "Activar biometría",
        "¿Deseas guardar tus credenciales para el próximo inicio de sesión con biometría?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Activar",
            onPress: async () => {
              try {
                const token = await SecureStore.getItemAsync("user_token");

                if (!token) {
                  Alert.alert("Token no disponible", "Vuelve a iniciar sesión.");
                  return;
                }

                await SecureStore.setItemAsync(
                  "biometric_credentials",
                  JSON.stringify({
                    email: user.email,
                    login_token: token,
                  })
                );

                setEnabled(true);
              } catch (error) {
                console.error("Error al guardar credenciales biométricas", error);
              }
            },
          },
        ]
      );
    } else {
      // Confirmación al desactivar
      Alert.alert(
        "Desactivar biometría",
        "¿Estás seguro de que deseas desactivar el acceso por biometría?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Desactivar",
            onPress: async () => {
              await SecureStore.deleteItemAsync("biometric_credentials");
              setEnabled(false);
            },
          },
        ]
      );
    }
  };

  if (!isBiometricAvailable) return null;

  return (
    <View style={{ marginTop: 30, alignItems: "center" }}>
      <Text style={{ marginBottom: 10 }}>
        Usar autenticación biométrica al iniciar sesión
      </Text>
      <Switch value={enabled} onValueChange={toggleBiometrics} />
    </View>
  );
};

export default BiometricToggle;