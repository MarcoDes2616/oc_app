import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CreateUserModal = ({
  visible,
  onClose,
  formData,
  setFormData,
  onSave,
  isEditing
}) => {
  const roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Usuario' }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Text>

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.firstname}
              onChangeText={(text) => setFormData({...formData, firstname: text})}
            />

            <Text style={styles.inputLabel}>Apellido</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={formData.lastname}
              onChangeText={(text) => setFormData({...formData, lastname: text})}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />

            <Text style={styles.inputLabel}>Usuario de Telegram (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="@usuario_telegram"
              autoCapitalize="none"
              value={formData.telegram_user}
              onChangeText={(text) => setFormData({...formData, telegram_user: text})}
            />

            <Text style={styles.inputLabel}>Rol</Text>
            <View style={styles.rolesContainer}>
              {roles.map(role => (
                <Pressable
                  key={role.id}
                  style={[
                    styles.roleOption,
                    formData.role_id === role.id && styles.selectedRole
                  ]}
                  onPress={() => setFormData({...formData, role_id: role.id})}
                >
                  <Text>{role.name}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.toggleContainer}>
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

            <View style={styles.toggleContainer}>
              <Text style={styles.inputLabel}>Firma declaración: </Text>
              <Pressable
                style={styles.statusToggle}
                onPress={() => setFormData({...formData, sign_declare: !formData.sign_declare})}
              >
                <Text>{formData.sign_declare ? 'Sí' : 'No'}</Text>
                <MaterialCommunityIcons 
                  name={formData.sign_declare ? "toggle-switch" : "toggle-switch-off"} 
                  size={24} 
                  color={formData.sign_declare ? "#6200ee" : "#757575"} 
                />
              </Pressable>
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={styles.saveButton}
                onPress={onSave}
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
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  roleOption: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedRole: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5ff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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

export default CreateUserModal;