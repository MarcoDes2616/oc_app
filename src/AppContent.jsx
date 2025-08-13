import { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import authService from './services/authServices';

const AppContent = () => {
  const { isAppLoading, user } = useContext(AppContext);
  
  if (isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppContent;