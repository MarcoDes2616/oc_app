import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProjectsView = ({ data }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Nuevo Proyecto</Text>
      </TouchableOpacity>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemStatus}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProjectsView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemStatus: {
    color: '#757575',
  },
});