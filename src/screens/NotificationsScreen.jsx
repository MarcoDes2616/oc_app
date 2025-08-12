import { FlatList, View, Text, StyleSheet } from 'react-native';
import useNotifications from '../hooks/useNotifications';
import { FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No hay notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      {notifications.length > 0 && (
        <FAB
          style={styles.fab}
          icon="delete"
          onPress={clearNotifications}
          label="Limpiar notificaciones"
          color="white"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 2,
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  body: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  date: { 
    color: '#666', 
    fontSize: 12,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
});