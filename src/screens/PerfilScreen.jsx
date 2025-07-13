import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';

const PerfilScreen = () => {
  const { logout } = useContext(AppContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>⚙️ Perfil y configuración</Text>
      <Button mode="outlined" onPress={logout}>
        Cerrar sesión
      </Button>
    </View>
  );
};

export default PerfilScreen;