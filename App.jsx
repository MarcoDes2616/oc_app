import { AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from 'react-native-paper';
import AppContent from './src/AppContent';
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content;

      // if (data.screen === 'profile') {
      //   navigation.navigate('Profile', { userId: data.userId });
      // }
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
