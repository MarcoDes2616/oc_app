import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProjectSelectionView = ({ projects, lists, onSelectProject }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione un proyecto</Text>
      <Text style={styles.subtitle}>Para ver las señales disponibles</Text>
      
      <FlatList
        data={projects?.filter(p => p.status) || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.projectsList}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.projectItem}
            onPress={() => onSelectProject(item)}
          >
            <Text style={styles.projectName}>{item.project_name}</Text>
            <Text style={styles.projectMarket}>
              {lists.markets?.find(m => m.id === item.market_id)?.market_name}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#6200ee" />
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proyectos activos</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  projectsList: {
    paddingHorizontal: 8,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  projectMarket: {
    fontSize: 14,
    color: '#757575',
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
  },
});

export default ProjectSelectionView;