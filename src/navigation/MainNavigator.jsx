import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SenalesScreen from "../screens/SenalesScreen";
import DashboardScreen from "../screens/DashboardScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Profile/SettingsScreen";
import AdminScreen from "../screens/AdminScreen";
import { DataProvider } from "../context/DataContext";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
  </ProfileStack.Navigator>
);

const MainNavigator = () => {
  const {user} = useContext(AppContext)

  const tabScreens = [
    {
      name: "Señales",
      component: SenalesScreen,
      icon: "chart-line",
      roles: [1, 2]
    },
    {
      name: "Dashboard",
      component: DashboardScreen,
      icon: "wallet",
      roles: [1, 2]
    },
    {
      name: "Notificaciones",
      component: NotificationsScreen,
      icon: "bell-outline",
      roles: [1, 2]
    },
    {
      name: "Perfil",
      component: ProfileStackScreen,
      icon: "account",
      roles: [1, 2]
    },
    {
      name: "Admin",
      component: AdminScreen,
      icon: "shield-account",
      roles: [1]
    },
    
  ];

  return (
    <DataProvider>
      <Tab.Navigator
        initialRouteName="Señales"
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#6200ee",
          tabBarStyle: { paddingBottom: 5, height: 95 },
        }}
      >
        {tabScreens.map((screen) => {
          if (!screen.roles.includes(user?.role_id)) return null;

          return (
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
        )}
      )}
      </Tab.Navigator>
    </DataProvider>
  );
};

export default MainNavigator;
