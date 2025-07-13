import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AppContext } from '../context/AppContext';

const PerfilScreen = () => {
  const { setUser } = useContext(AppContext);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>⚙️ Perfil y configuración</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default PerfilScreen;