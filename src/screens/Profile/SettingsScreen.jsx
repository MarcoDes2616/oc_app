import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Switch, Button, Divider } from 'react-native-paper';
import ProfileMenu from '../../components/ProfileMenu';
import BiometricToggle from "../../components/BiometricToggle";
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { logout, deletePushToken, user, enablePushNotifications } = useContext(AppContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!user?.pushToken);
  const [loading, setLoading] = useState(false);

  const handleToggleNotifications = async (value) => {
    setLoading(true);
    try {
      if (!value) {
        await deletePushToken();
      } else {
        await enablePushNotifications();
      }
      setNotificationsEnabled(value);
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificaciones');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección de Perfil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {/* <MaterialIcons name="person" size={20} color="#6200ee" />  */}
        </Text>
        <ProfileMenu />
      </View>

      <Divider style={styles.divider} />

      {/* Configuración de Seguridad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons name="security" size={20} color="#6200ee" /> Seguridad
        </Text>
        <BiometricToggle />
      </View>

      <Divider style={styles.divider} />

      {/* Configuración de Notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons name="notifications" size={20} color="#6200ee" /> Notificaciones
        </Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Recibir notificaciones push</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            disabled={loading}
            color="#6200ee"
          />
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Botón de Cerrar Sesión */}
      <Button 
        mode="outlined" 
        style={styles.logoutButton}
        onPress={logout}
        labelStyle={styles.logoutButtonText}
      >
        Cerrar sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 2,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#555',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#eee',
    height: 1,
  },
  logoutButton: {
    marginTop: 30,
    borderColor: '#e53935',
    borderWidth: 1,
  },
  logoutButtonText: {
    color: '#e53935',
  },
});

export default SettingsScreen;