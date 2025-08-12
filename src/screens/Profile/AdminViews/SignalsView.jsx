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
import { useData } from "../../../context/DataContext";
import * as ImagePicker from "expo-image-picker";
import SignalItem from "../../../components/SignalItem";
import ProjectSelectionView from "../../../components/ProjectSelectionView";
import SignalsListView from "../../../components/SignalsListView";

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
    project_id: selectedProject?.id,
    instrument_id: "",
    operation_type_id: "",
    image_reference: null,
    price_range_min: "",
    price_range_max: "",
    expected_target: "",
    entry_point: "",
    sl_price: "",
    signal_status_id: 5, // Estado por defecto
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
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false);
          setFormData(initFormData);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingSignal ? "Editar Señal" : "Nueva Señal"}
              </Text>

              {/* Instrumento */}
              <Text style={styles.inputLabel}>Instrumento *</Text>
              <View style={styles.pickerContainer}>
                {lists.instruments?.map((instrument) => (
                  <Pressable
                    key={instrument.id}
                    style={[
                      styles.optionButton,
                      formData.instrument_id === instrument.id &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, instrument_id: instrument.id })
                    }
                  >
                    <Text>{instrument.instrument_name}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Tipo de operación */}
              <Text style={styles.inputLabel}>Tipo de Operación *</Text>
              <View style={styles.pickerContainer}>
                {lists.operationsTypes?.map((operation) => (
                  <Pressable
                    key={operation.id}
                    style={[
                      styles.optionButton,
                      formData.operation_type_id === operation.id &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        operation_type_id: operation.id,
                      })
                    }
                  >
                    <Text>{operation.operation_type_name}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Estado de la señal */}
              <Text style={styles.inputLabel}>Estado *</Text>
              <View style={styles.pickerContainer}>
                {lists.signalStatus?.map((status) => (
                  <Pressable
                    key={status.id}
                    style={[
                      styles.optionButton,
                      formData.signal_status_id === status.id &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, signal_status_id: status.id })
                    }
                  >
                    <Text>{status.signal_status_name}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Campos numéricos */}
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.inputLabel}>Precio Rango Min</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.price_range_min}
                    onChangeText={(text) =>
                      setFormData({ ...formData, price_range_min: text })
                    }
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.inputLabel}>Precio Rango Max</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.price_range_max}
                    onChangeText={(text) =>
                      setFormData({ ...formData, price_range_max: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.inputLabel}>Punto de Entrada</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.entry_point}
                    onChangeText={(text) =>
                      setFormData({ ...formData, entry_point: text })
                    }
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.inputLabel}>Stop Loss</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={formData.sl_price}
                    onChangeText={(text) =>
                      setFormData({ ...formData, sl_price: text })
                    }
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Target Esperado (pips)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.expected_target}
                onChangeText={(text) =>
                  setFormData({ ...formData, expected_target: text })
                }
              />

              {/* Imagen */}
              <Text style={styles.inputLabel}>Referencia de Imagen</Text>
              <Pressable style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerText}>
                  {formData.image_reference
                    ? "Cambiar imagen"
                    : "Seleccionar imagen"}
                </Text>
              </Pressable>

              {formData.image_reference && (
                <Image
                  source={{ uri: formData.image_reference }}
                  style={styles.imagePreview}
                  resizeMode="contain"
                />
              )}

              {/* Estado de éxito */}
              <View style={styles.statusContainer}>
                <Text style={styles.inputLabel}>¿Operación exitosa?</Text>
                <Pressable
                  style={styles.statusToggle}
                  onPress={handleStatusToggle}
                >
                  <Text>{formData.is_successful ? "Sí" : "No"}</Text>
                  <MaterialCommunityIcons
                    name={
                      formData.is_successful
                        ? "toggle-switch"
                        : "toggle-switch-off"
                    }
                    size={24}
                    color={formData.is_successful ? "#6200ee" : "#757575"}
                  />
                </Pressable>
              </View>

              {/* Botones del modal */}
              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    setFormData(initFormData);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveSignal}
                  disabled={
                    !formData.instrument_id || !formData.operation_type_id
                  }
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
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
    fontWeight: "500",
    marginBottom: 8,
    color: "#424242",
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
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  optionButton: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedOption: {
    borderColor: "#6200ee",
    backgroundColor: "#f3e5ff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    width: "48%",
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#6200ee",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
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
    opacity: 1,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default SignalsView;
