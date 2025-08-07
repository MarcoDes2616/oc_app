import { View, StyleSheet } from 'react-native';
import { FAB, Badge } from 'react-native-paper';
import { useNotifications } from '../hooks/useNotifications'; // Asegúrate de que la ruta sea correcta

const NotificationFabButton = ({ navigation }) => {
  const { notifications } = useNotifications();

  return (
    <View style={styles.container}>
      <FAB
        style={styles.fab}
        icon="bell"
        onPress={() => navigation.navigate('NotificationsScreen')}
      />
      {notifications.length > 0 && (
        <Badge size={24} style={styles.badge}>
          {notifications.length}
        </Badge>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fab: {
    backgroundColor: '#6200ee', // Color personalizable
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red', // Color del badge
  },
});

export default NotificationFabButton;