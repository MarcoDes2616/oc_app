import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext, AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './src/screens/LoginScreen';
import MainNavigator from './src/navigation/MainNavigator'; // ← Crea este con tus pantallas internas

const AppContent = () => {
  const { user } = useContext(AppContext);

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AppProvider>
  );
}
