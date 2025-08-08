import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import authService from './services/authServices';

const AppContent = () => {
  const { isAppLoading } = useContext(AppContext);

  const token = async() => await authService.getCurrentUser();

  if (isAppLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppContent;