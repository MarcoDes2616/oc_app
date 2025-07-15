import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import BiometricToggle from "../components/BiometricToggle";

const PerfilScreen = () => {
  const { logout } = useContext(AppContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>⚙️ Perfil y configuración</Text>

      {/* Aquí el bi-state */}
      <BiometricToggle />

      <Button mode="outlined" style={{ marginTop: 30 }} onPress={logout}>
        Cerrar sesión
      </Button>
    </View>
  );
};

export default PerfilScreen;