import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CreateSignalModal = ({
  isModalVisible,
  formData,
  closeModal,
  handleStatusToggle,
  pickImage,
  setFormData,
  handleSaveSignal,
  lists,
  editingSignal,
  market_id,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSignal ? "Editar Señal" : "Nueva Señal"}
            </Text>

            {/* Instrumento */}
            <Text style={styles.inputLabel}>Instrumento / Par *</Text>
            <View style={styles.pickerContainer}>
              {lists.instruments?.map((instrument) => {
                if (instrument.market_id !== market_id) return null;
                return (
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
                )
              })}
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
              <Pressable style={styles.cancelButton} onPress={closeModal}>
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

export default CreateSignalModal;
