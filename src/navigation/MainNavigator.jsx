import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import useNotifications from "../hooks/useNotifications";
import SenalesScreen from "../screens/SenalesScreen";
import DashboardScreen from "../screens/DashboardScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Profile/SettingsScreen";
import AdminScreen from "../screens/Profile/AdminScreen";
import { DataProvider } from "../context/DataContext";

const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Admin" component={AdminScreen} />
  </ProfileStack.Navigator>
);

const MainNavigator = () => {
  const { notifications } = useNotifications();

  const tabScreens = [
    {
      name: "Señales",
      component: SenalesScreen,
      icon: "chart-line",
    },
    {
      name: "Dashboard",
      component: DashboardScreen,
      icon: "wallet",
    },
    {
      name: "Notificaciones",
      component: NotificationsScreen,
      icon: "bell-outline",
    },
    {
      name: "Perfil",
      component: ProfileStackScreen,
      icon: "account",
    },
  ];

  return (
    <DataProvider>
      <Tab.Navigator
        initialRouteName="Perfil"
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#6200ee",
          tabBarStyle: { paddingBottom: 5, height: 95 },
        }}
      >
        {tabScreens.map((screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              tabBarLabel: screen.name,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name={screen.icon}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </DataProvider>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
  },
});

export default MainNavigator;
