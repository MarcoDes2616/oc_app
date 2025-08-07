import { View, Text, StyleSheet } from 'react-native';
import ProfileMenu from '../../components/ProfileMenu';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  
  return (
    <View style={styles.container}>
      <ProfileMenu />
      <Text style={styles.title}>Mi Cuenta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});

export default ProfileScreen;