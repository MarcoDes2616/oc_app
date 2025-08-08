import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProjectsView from './AdminViews/ProjectsView';
import SignalsView from './AdminViews/SignalsView';
import UsersView from './AdminViews/UsersView';
import { useData } from '../../context/DataContext';
import ViewSelectorButton from '../../components/ViewSelectorButton';

const viewOptions = [
  {
    id: 'projects',
    icon: 'folder-multiple',
    label: 'Proyectos',
    component: ProjectsView
  },
  {
    id: 'signals',
    icon: 'chart-line',
    label: 'Señales',
    component: SignalsView
  },
  {
    id: 'users',
    icon: 'account-group',
    label: 'Usuarios',
    component: UsersView
  }
];

const AdminScreen = () => {
  const [activeView, setActiveView] = useState('projects');
  const { 
    projects, 
    signals, 
    users, 
    loading,
    error 
  } = useData();

  const ActiveComponent = viewOptions.find(v => v.id === activeView)?.component;
  const dataMap = {
    projects,
    signals,
    users
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        {viewOptions.map((option) => (
          <ViewSelectorButton
            key={option.id}
            icon={option.icon}
            label={option.label}
            isActive={activeView === option.id}
            onPress={() => setActiveView(option.id)}
          />
        ))}
      </View>

      <View style={styles.contentContainer}>
        {ActiveComponent && (
          <ActiveComponent 
            data={dataMap[activeView]} 
            loading={loading}
            error={error}
          />
        )}
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
  contentContainer: {
    flex: 1,
    padding: 16
  }
});

export default AdminScreen;