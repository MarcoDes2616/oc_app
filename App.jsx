import { AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from "react-native-paper";
import AppContent from "./src/AppContent";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import useNotifications from "./src/hooks/useNotifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "./src/components/SafeAreaView";
import { StyleSheet } from "react-native";

export default function App() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
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
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <AppProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.SafeAreaView}>
            <AppContent />
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
