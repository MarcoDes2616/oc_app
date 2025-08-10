import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Pressable,
  ScrollView
} from 'react-native';
import { useData } from "../../../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

const ProjectsView = () => {
  const { 
    projects, 
    loading, 
    lists,
    actions
  } = useData();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);
  
  // Form state
  const initFormData = {
    project_name: '',
    market_id: '',
    init_date: new Date(),
    end_date: null,
    status: true
  }
  const [formData, setFormData] = useState(initFormData);

  const handleAddProject = () => {
    setFormData(initFormData);
    setEditingProject(null);
    setIsModalVisible(true);
  };

  const handleEditProject = (project) => {
    setFormData({
      project_name: project.project_name,
      market_id: project.market_id,
      init_date: new Date(project.init_date),
      end_date: project.end_date ? new Date(project.end_date) : null,
      status: project.status
    });
    setEditingProject(project);
    setIsModalVisible(true);
  };

  const handleSaveProject = () => {
    const projectData = {
      ...formData,
      init_date: formData.init_date.toISOString().split('T')[0],
      end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null
    };
    if (editingProject) {
      actions.projects.update(editingProject.id, projectData)
        .then(() => {
          setIsModalVisible(false);
          setEditingProject(null);
        })
        .catch(err => console.error("Error updating project:", err));
    } else {
      actions.projects.create(projectData)
        .then(() => {
          setIsModalVisible(false);
        })
        .catch(err => console.error("Error creating project:", err));
    }
    setFormData(initFormData);
    setEditingProject(null);
    setShowActions(null);
    setIsModalVisible(false);
  };

  const handleDeleteProject = (id) => {
    console.log("Eliminando proyecto con id:", id);
    setShowActions(null);
  };

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(null);
    if (selectedDate) {
      setFormData({...formData, [field]: selectedDate});
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Nuevo Proyecto</Text>
      </TouchableOpacity>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.project_name}</Text>
              <Text style={styles.itemSubtitle}>
                {lists.markets.find(m => m.id === item.market_id)?.market_name || 'Sin mercado'}
              </Text>
              <Text style={styles.itemDates}>
                {new Date(item.init_date).toLocaleDateString()} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Presente'}
              </Text>
            </View>
            
            <Pressable onPress={() => toggleActions(item.id)}>
              <MaterialIcons name="more-vert" size={24} color="#757575" />
            </Pressable>

            {showActions === item.id && (
              <View style={styles.actionsMenu}>
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => handleEditProject(item)}
                >
                  <MaterialIcons name="edit" size={18} color="#6200ee" />
                  <Text style={styles.actionText}>Editar</Text>
                </Pressable>
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => handleDeleteProject(item.id)}
                >
                  <MaterialIcons name="delete" size={18} color="#ff0000" />
                  <Text style={[styles.actionText, { color: "#ff0000" }]}>Eliminar</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proyectos disponibles</Text>
          </View>
        )}
      />

      {/* Modal del formulario */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </Text>

              <Text style={styles.inputLabel}>Nombre del proyecto</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del proyecto"
                value={formData.project_name}
                onChangeText={(text) => setFormData({...formData, project_name: text})}
              />

              <Text style={styles.inputLabel}>Mercado</Text>
              <View style={styles.pickerContainer}>
                {lists.markets.map(market => (
                  <Pressable
                    key={market.id}
                    style={[
                      styles.marketOption,
                      formData.market_id === market.id && styles.selectedMarket
                    ]}
                    onPress={() => setFormData({...formData, market_id: market.id})}
                  >
                    <Text>{market.market_name}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Fecha de inicio</Text>
              <Pressable 
                style={styles.dateInput}
                onPress={() => setShowDatePicker('init_date')}
              >
                <Text>{formData.init_date.toLocaleDateString()}</Text>
              </Pressable>

              <Text style={styles.inputLabel}>Fecha de finalización (opcional)</Text>
              <Pressable 
                style={styles.dateInput}
                onPress={() => setShowDatePicker('end_date')}
              >
                <Text>
                  {formData.end_date ? formData.end_date.toLocaleDateString() : 'Seleccionar fecha'}
                </Text>
              </Pressable>

              <View style={styles.statusContainer}>
                <Text style={styles.inputLabel}>Estado: </Text>
                <Pressable
                  style={styles.statusToggle}
                  onPress={() => setFormData({...formData, status: !formData.status})}
                >
                  <Text>{formData.status ? 'Activo' : 'Inactivo'}</Text>
                  <MaterialCommunityIcons 
                    name={formData.status ? "toggle-switch" : "toggle-switch-off"} 
                    size={24} 
                    color={formData.status ? "#6200ee" : "#757575"} 
                  />
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={formData[showDatePicker] || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, showDatePicker)}
                />
              )}

              <View style={styles.modalButtons}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable 
                  style={styles.saveButton}
                  onPress={handleSaveProject}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  itemDates: {
    fontSize: 12,
    color: "#757575",
    fontStyle: 'italic',
  },
  actionsMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
    minWidth: 120,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#757575",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#424242',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  marketOption: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedMarket: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5ff',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#757575",
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#6200ee",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default ProjectsView;