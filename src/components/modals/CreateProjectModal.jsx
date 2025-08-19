import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useData } from "../../context/DataContext";
import { useState } from "react";

const CreateProjectModal = ({
  isModalVisible,
  setIsModalVisible,
  formData,
  setFormData,
  editingProject,
  handleSaveProject
}) => {
  const { lists } = useData();
  const [showDatePicker, setShowDatePicker] = useState(null);
  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(null);
    if (selectedDate) {
      setFormData({ ...formData, [field]: selectedDate });
    }
  };

  return (
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
              {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
            </Text>

            <Text style={styles.inputLabel}>Nombre del proyecto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del proyecto"
              value={formData.project_name}
              onChangeText={(text) =>
                setFormData({ ...formData, project_name: text })
              }
            />

            <Text style={styles.inputLabel}>Mercado</Text>
            <View style={styles.pickerContainer}>
              {lists.markets.map((market) => (
                <Pressable
                  key={market.id}
                  style={[
                    styles.marketOption,
                    formData.market_id === market.id && styles.selectedMarket,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, market_id: market.id })
                  }
                >
                  <Text>{market.market_name}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Fecha de inicio</Text>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker("init_date")}
            >
              <Text>{formData.init_date.toLocaleDateString()}</Text>
            </Pressable>

            <Text style={styles.inputLabel}>
              Fecha de finalización (opcional)
            </Text>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker("end_date")}
            >
              <Text>
                {formData.end_date
                  ? formData.end_date.toLocaleDateString()
                  : "Seleccionar fecha"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={formData[showDatePicker] || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange(event, date, showDatePicker)
                }
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSaveProject}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  marketOption: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedMarket: {
    borderColor: "#6200ee",
    backgroundColor: "#f3e5ff",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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

export default CreateProjectModal;
