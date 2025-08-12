import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useData } from "../../../context/DataContext";
import SignalItem from "../../../components/SignalItem";
import ProjectSelectionView from "../../../components/ProjectSelectionView";
import SignalsListView from "../../../components/SignalsListView";
import CreateSignalModal from "../../../components/modals/CreateSignalModal";

const SignalsView = () => {
  const { lists, actions, loading, projects } = useData();

  // Estados principales
  const [selectedProject, setSelectedProject] = useState(null);
  const [signals, setSignals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSignal, setEditingSignal] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Estado inicial del formulario
  const initFormData = {
    project_id: selectedProject?.id || "",
    instrument_id: 1,
    operation_type_id: 1,
    image_reference: null,
    price_range_min: "6225",
    price_range_max: "6250",
    expected_target: "292",
    entry_point: "6228",
    sl_price: "6284",
    signal_status_id: 5,
    is_successful: false,
  };

  const [formData, setFormData] = useState(initFormData);

  useEffect(() => {
    if (selectedProject) {
      fetchSignals();
      setFormData((prev) => ({
        ...initFormData,
        project_id: selectedProject.id,
      }));
    }
  }, [selectedProject, filterStatus]);

  const fetchSignals = async () => {
    setRefreshing(true);
    try {
      const params = {
        project_id: selectedProject.id,
        ...(filterStatus && { signal_status_id: filterStatus }),
      };
      const response = await actions.signals.getAll(params);
      setSignals(response);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType?.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFormData({ ...formData, image_reference: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      alert("Ocurrió un error al seleccionar la imagen");
    }
  };

  const handleAddSignal = () => {
    setFormData(initFormData);
    setEditingSignal(null);
    setIsModalVisible(true);
  };

  const handleEditSignal = (signal) => {
    setFormData({
      project_id: signal.project_id,
      instrument_id: signal.instrument_id,
      operation_type_id: signal.operation_type_id,
      image_reference: signal.image_reference,
      price_range_min: signal.price_range_min?.toString() || "",
      price_range_max: signal.price_range_max?.toString() || "",
      expected_target: signal.expected_target?.toString() || "",
      entry_point: signal.entry_point?.toString() || "",
      sl_price: signal.sl_price?.toString() || "",
      signal_status_id: signal.signal_status_id,
      is_successful: signal.is_successful,
    });
    setEditingSignal(signal);
    setIsModalVisible(true);
  };

  const handleSaveSignal = async () => {
    try {
      const signalData = {
        ...formData,
        price_range_min: parseFloat(formData.price_range_min) || null,
        price_range_max: parseFloat(formData.price_range_max) || null,
        expected_target: parseFloat(formData.expected_target) || null,
        entry_point: parseFloat(formData.entry_point) || null,
        sl_price: parseFloat(formData.sl_price) || null,
      };

      if (editingSignal) {
        await actions.signals.update(editingSignal.id, signalData);
      } else {
        await actions.signals.create(signalData);
      }

      fetchSignals();
      setIsModalVisible(false);
      setFormData(initFormData); // Resetear formulario
    } catch (error) {
      console.error("Error saving signal:", error);
    }
  };

  const handleDeleteSignal = async (id) => {
    try {
      await actions.signals.delete(id);
      fetchSignals();
    } catch (error) {
      console.error("Error deleting signal:", error);
    }
    setShowActions(null);
  };

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  const handleStatusToggle = () => {
    setFormData({ ...formData, is_successful: !formData.is_successful });
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setFormData(initFormData);
  };

  if (loading && !refreshing) return <ActivityIndicator size="large" />;

  // Vista de selección de proyecto
  if (!selectedProject) {
    return (
      <ProjectSelectionView
        projects={projects}
        lists={lists}
        onSelectProject={setSelectedProject}
      />
    );
  }

  // Vista principal de señales
  return (
    <View style={styles.container}>
      {/* Botón para agregar nueva señal */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSignal}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Nueva Señal</Text>
      </TouchableOpacity>

      <SignalsListView
        selectedProject={selectedProject}
        signals={signals}
        lists={lists}
        refreshing={refreshing}
        onRefresh={fetchSignals}
        onBack={handleBack}
        hideActions={false}
        setFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        toggleActions={toggleActions}
        onDelete={handleDeleteSignal}
        onEdit={handleEditSignal}
        showActions={showActions}
      />

      {/* Modal del formulario */}
      <CreateSignalModal 
        formData={formData} 
        isModalVisible={isModalVisible} 
        closeModal={closeModal}
        handleStatusToggle={handleStatusToggle}
        setFormData={setFormData}
        pickImage={pickImage}
        handleSaveSignal={handleSaveSignal}
        lists={lists}
        editingSignal={editingSignal}
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
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 24,
  },
  projectsList: {
    paddingHorizontal: 8,
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  projectMarket: {
    fontSize: 14,
    color: "#757575",
    marginRight: 16,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  projectDates: {
    fontSize: 14,
    color: "#757575",
  },
  filterContainer: {
    marginBottom: 16,
    height: 60,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 35,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  activeFilter: {
    color: "#fff",
    backgroundColor: "#6200ee",
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
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 14,
  },
  itemDetail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  signalImage: {
    width: "100%",
    height: 150,
    marginTop: 8,
    borderRadius: 8,
  },
  actionsMenu: {
    position: "absolute",
    right: 0,
    top: 40,
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
  emptySubtext: {
    color: "#bdbdbd",
    fontSize: 14,
    marginTop: 4,
  },
  
});

export default SignalsView;
