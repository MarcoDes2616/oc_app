import { View, Text, StyleSheet } from 'react-native';
import ProfileMenu from '../../components/ProfileMenu';

const AdminScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ProfileMenu />
      <Text>Panel de Administración</Text>
    </View>
  );
}

export default AdminScreen;