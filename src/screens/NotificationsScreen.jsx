import { FlatList, View, Text, StyleSheet } from 'react-native';
import useNotifications from '../hooks/useNotifications';

export default function NotificationsScreen() {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        )}
      />
      <Button 
        title="Limpiar notificaciones" 
        onPress={clearNotifications} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  notificationCard: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#666', fontSize: 12 },
});