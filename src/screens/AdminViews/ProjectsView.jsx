import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useData } from "../../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CreateProjectModal from "../../components/modals/CreateProjectModal";

const ProjectsView = () => {
  const { projects, loading, lists, actions } = useData();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const initFormData = {
    project_name: "",
    market_id: "",
    init_date: new Date(),
    end_date: null,
  };
  const [formData, setFormData] = useState(initFormData);

  const toggleStatus = async (project) => {
    if (project.status) {
      await actions.projects.update(project.id, { status: false });
    } else {
      const activeProject = projects.find((p) => p.status);
      if (activeProject) {
        await actions.projects.update(activeProject.id, { status: false });
      }
      await actions.projects.update(project.id, { status: true });
    }
  };

  const handleToggleStatus = async (project) => {
    Alert.alert(
      `${
        !project.status
          ? "Excelente, ahora las señales estarán disponibles!"
          : "Tus usuarios no podrán ver las señales de este proyecto"
      }`,
      `¿Estás seguro de que deseas ${
        project.status ? "desactivar" : "activar"
      } el proyecto "${project.project_name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: project.status ? "Desactivar" : "Activar",
          onPress: () => toggleStatus(project),
        },
      ]
    );
  };

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
    });
    setEditingProject(project);
    setIsModalVisible(true);
  };

  const handleSaveProject = () => {
    const projectData = {
      ...formData,
      init_date: formData.init_date.toISOString().split("T")[0],
      end_date: formData.end_date
        ? formData.end_date.toISOString().split("T")[0]
        : null,
    };
    try {
      if (editingProject) {
        actions.projects.update(editingProject.id, projectData);
      } else {
        actions.projects.create({ ...projectData, status: false });
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setInitialValues();
    }
  };

  const setInitialValues = () => {
    setFormData(initFormData);
    setEditingProject(null);
    setIsModalVisible(false);
    setShowActions(null);
  };

  const handleDeleteProject = (id) => {
    Alert.alert(
      "Eliminar proyecto",
      "¿Estás seguro de que deseas eliminar este proyecto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            actions.projects
              .delete(id)
              .catch((err) => console.error("Error deleting project:", err));
            setShowActions(null);
          },
        },
      ]
    );
  };

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={18} color="#6200ee" />
        <Text style={styles.infoText}>
          Solo puede haber un proyecto activo a la vez
        </Text>
      </View>

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
                {lists.markets.find((m) => m.id === item.market_id)
                  ?.market_name || "Sin mercado"}
              </Text>
              <Text style={styles.itemDates}>
                {new Date(item.init_date).toLocaleDateString()} -{" "}
                {item.end_date
                  ? new Date(item.end_date).toLocaleDateString()
                  : "Presente"}
              </Text>
            </View>

            <View style={styles.itemControls}>
              <Pressable
                style={styles.statusButton}
                onPress={() => handleToggleStatus(item)}
              >
                <MaterialCommunityIcons
                  name={item.status ? "toggle-switch" : "toggle-switch-off"}
                  size={32}
                  color={item.status ? "#6200ee" : "#757575"}
                />
              </Pressable>

              <Pressable onPress={() => toggleActions(item.id)}>
                <MaterialIcons name="more-vert" size={24} color="#757575" />
              </Pressable>
            </View>

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
                  <Text style={[styles.actionText, { color: "#ff0000" }]}>
                    Eliminar
                  </Text>
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
      <CreateProjectModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        formData={formData}
        setFormData={setFormData}
        editingProject={editingProject}
        handleSaveProject={handleSaveProject}
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 8,
    color: "#6200ee",
    fontSize: 14,
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
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusButton: {
    marginRight: 12,
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
    fontStyle: "italic",
  },
  actionsMenu: {
    position: "absolute",
    right: 40,
    top: 5,
    backgroundColor: "white",
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
});

export default ProjectsView;
