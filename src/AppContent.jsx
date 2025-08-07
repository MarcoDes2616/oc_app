import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';

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