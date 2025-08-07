import { View, Text } from 'react-native';
import ProfileMenu from '../../components/ProfileMenu';

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ProfileMenu />
      <Text>Configuración de la App</Text>
    </View>
  );
}

export default SettingsScreen;