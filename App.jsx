import { AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from 'react-native-paper';
import AppContent from './src/AppContent';
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import useNotifications from "./src/hooks/useNotifications";

export default function App() {
 const { addNotification } = useNotifications();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;

      addNotification({
        id: Date.now().toString(),
        title,
        body,
        data,
        date: new Date().toISOString(),
      });

      if (data?.screen) {
        navigation.navigate(data.screen, data);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AppProvider>
  );
}
