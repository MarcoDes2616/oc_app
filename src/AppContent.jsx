import { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import authService from './services/authServices';

const AppContent = () => {
  const { isAppLoading, user } = useContext(AppContext);
  const [hasToken, setHasToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await authService.getCurrentUser();
        setHasToken(!!token);
      } catch (error) {
        setHasToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [user]);
  
  if (isAppLoading || isCheckingToken) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {hasToken ? <MainNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppContent;