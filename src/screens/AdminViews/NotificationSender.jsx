import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';

const NotificationSender = () => {
  const { sendCustomNotification } = useData();
  const [notification, setNotification] = useState({
    title: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    if (!notification.title || !notification.message) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsSending(true);
    try {
      await sendCustomNotification(notification);
      Alert.alert('Éxito', 'Notificación enviada correctamente');
      setNotification({ title: '', message: '' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la notificación');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enviar Notificación Personalizada</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Nueva señal de V25!"
          value={notification.title}
          onChangeText={(text) => setNotification({...notification, title: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Ej: Tradea con precaución..."
          multiline
          numberOfLines={4}
          value={notification.message}
          onChangeText={(text) => setNotification({...notification, message: text})}
        />
      </View>

      <Pressable 
        style={styles.sendButton}
        onPress={handleSendNotification}
        disabled={isSending}
      >
        <MaterialIcons 
          name="send" 
          size={20} 
          color="white" 
          style={styles.icon} 
        />
        <Text style={styles.sendButtonText}>
          {isSending ? 'Enviando...' : 'Enviar Notificación'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});

export default NotificationSender;