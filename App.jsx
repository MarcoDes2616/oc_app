import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from "./src/context/AppContext";

import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';

const AppContent = () => {
  const { user, isAppLoading } = useContext(AppContext);

  if (isAppLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppContent;