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
import { Text, StyleSheet } from "react-native";
import LoginScreen from "../screens/LoginScreen";

const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();


const MainNavigator = () => {
  const {user} = useContext(AppContext)
  
  const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {
        user ? (
          <>
          <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
          <ProfileStack.Screen name="Settings" component={SettingsScreen} />
          </>
        ): (
          <ProfileStack.Screen name="ProfileMain" component={LoginScreen} />
        )
      }
    </ProfileStack.Navigator>
  );
  
  const tabScreens = [
    {
      name: "Señales",
      component: SenalesScreen,
      icon: "chart-line",
      roles: [1, 2, undefined]
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
      roles: [1, 2, undefined]
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
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e5ea",
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          headerShown: false,
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
      {/* <Text style={styles.maintenanceText}>MainNavigator is under maintenance.</Text> */}
    </DataProvider>
  );
};

export default MainNavigator;


const styles = StyleSheet.create({
  maintenanceText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: 'red',
    borderWidth: 2,
    borderColor: 'red',
    padding: 10,
    textAlign: 'center',
  },
});