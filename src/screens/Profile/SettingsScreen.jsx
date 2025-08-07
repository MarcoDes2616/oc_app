import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { View, Text } from 'react-native';
import ProfileMenu from '../../components/ProfileMenu';
import BiometricToggle from "../../components/BiometricToggle";
import { Button } from 'react-native-paper';

const SettingsScreen = () => {
  const { logout } = useContext(AppContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ProfileMenu />
      <Text style={{ marginBottom: 20 }}>⚙️ Perfil y configuración</Text>

      {/* Aquí el bi-state */}
      <BiometricToggle />

      <Button mode="outlined" style={{ marginTop: 30 }} onPress={logout}>
        Cerrar sesión
      </Button>
    </View>
  );
}

export default SettingsScreen;