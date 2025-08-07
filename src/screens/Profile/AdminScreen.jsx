import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componentes de las vistas (los crearemos después)
import ProjectsView from './AdminViews/ProjectsView';
import SignalsView from './AdminViews/SignalsView';
import UsersView from './AdminViews/UsersView';

const AdminScreen = () => {
  const [activeView, setActiveView] = useState('projects'); // 'projects', 'signals', 'users'
  
  // Datos de ejemplo (luego los reemplazarás con tu API)
  const sampleData = {
    projects: [
      { id: 1, name: 'App Móvil', status: 'active' },
      { id: 2, name: 'Portal Web', status: 'pending' }
    ],
    signals: [
      { id: 1, name: 'BTC Buy', type: 'buy', status: 'active' },
      { id: 2, name: 'ETH Sell', type: 'sell', status: 'pending' }
    ],
    users: [
      { id: 1, name: 'Juan Pérez', role: 'admin', email: 'juan@example.com' },
      { id: 2, name: 'María García', role: 'user', email: 'maria@example.com' }
    ]
  };

  return (
    <View style={styles.container}>
      {/* Selector de vistas */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity 
          style={[styles.selectorButton, activeView === 'projects' && styles.activeButton]}
          onPress={() => setActiveView('projects')}
        >
          <MaterialCommunityIcons 
            name="folder-multiple" 
            size={24} 
            color={activeView === 'projects' ? '#6200ee' : '#757575'} 
          />
          <Text style={[styles.selectorText, activeView === 'projects' && styles.activeText]}>
            Proyectos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.selectorButton, activeView === 'signals' && styles.activeButton]}
          onPress={() => setActiveView('signals')}
        >
          <MaterialCommunityIcons 
            name="chart-line" 
            size={24} 
            color={activeView === 'signals' ? '#6200ee' : '#757575'} 
          />
          <Text style={[styles.selectorText, activeView === 'signals' && styles.activeText]}>
            Señales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.selectorButton, activeView === 'users' && styles.activeButton]}
          onPress={() => setActiveView('users')}
        >
          <MaterialCommunityIcons 
            name="account-group" 
            size={24} 
            color={activeView === 'users' ? '#6200ee' : '#757575'} 
          />
          <Text style={[styles.selectorText, activeView === 'users' && styles.activeText]}>
            Usuarios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.contentContainer}>
        {activeView === 'projects' && <ProjectsView data={sampleData.projects} />}
        {activeView === 'signals' && <SignalsView data={sampleData.signals} />}
        {activeView === 'users' && <UsersView data={sampleData.users} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  selectorButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8
  },
  activeButton: {
    backgroundColor: '#f3e5ff'
  },
  selectorText: {
    marginTop: 5,
    fontSize: 12,
    color: '#757575'
  },
  activeText: {
    color: '#6200ee',
    fontWeight: '600'
  },
  contentContainer: {
    flex: 1,
    padding: 16
  }
});

export default AdminScreen;