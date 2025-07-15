import { AppProvider } from "./src/context/AppContext";
import { Provider as PaperProvider } from 'react-native-paper';
import AppContent from './src/AppContent';



export default function App() {
  return (
    <AppProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AppProvider>
  );
}
