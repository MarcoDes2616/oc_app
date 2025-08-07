import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import useNotifications from "../hooks/useNotifications";
import SenalesScreen from "../screens/SenalesScreen";
import DashboardScreen from "../screens/DashboardScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Profile/SettingsScreen";
import AdminScreen from "../screens/Profile/AdminScreen";

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

  return (
    <Tab.Navigator
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#6200ee",
        tabBarStyle: { paddingBottom: 5, height: 95 },
      }}
    >
      <Tab.Screen
        name="Señales"
        component={SenalesScreen}
        options={{
          tabBarLabel: "Señales",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notificaciones",
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="bell-outline"
                color={color}
                size={size}
              />
              {notifications.length > 0 && (
                <Badge size={16} style={styles.badge}>
                  {notifications.length}
                </Badge>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
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
