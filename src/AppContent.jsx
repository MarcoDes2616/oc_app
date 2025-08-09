import { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext } from './context/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import authService from './services/authServices';

const AppContent = () => {
  const { isAppLoading } = useContext(AppContext);
  const [hasToken, setHasToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const user = await authService.getCurrentUser();
        setHasToken(!!user?.token);
      } catch (error) {
        setHasToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);

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