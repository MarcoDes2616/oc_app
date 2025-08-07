import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) setNotifications(JSON.parse(saved));
    };
    loadNotifications();
  }, []);

  const addNotification = async (notification) => {
    const updated = [...notifications, notification];
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const clearNotifications = async () => {
  await AsyncStorage.removeItem('notifications');
  setNotifications([]);
};

  return { notifications, addNotification, clearNotifications };
}