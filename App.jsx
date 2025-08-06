import { AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from 'react-native-paper';
import AppContent from './src/AppContent';
import * as Notifications from "expo-notifications";
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    // Escuchar notificaciones recibidas
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación recibida:", notification);
        // Aquí puedes navegar a una pantalla específica
        // Ejemplo: navigation.navigate("Post", { id: notification.data.postId });
      }
    );

    return () => subscription.remove(); // Limpiar listener al desmontar
  }, []);

  return (
    <AppProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AppProvider>
  );
}
