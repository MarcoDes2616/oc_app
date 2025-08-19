import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useData } from "../../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CreateUserModal from "../../components/modals/CreateUserModal";
import UserItem from "../../components/UserItems";

const UsersView = () => {
  const { users, loading, actions } = useData();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const initFormData = {
    firstname: "",
    lastname: "",
    email: "",
    role_id: 2,
    status: true,
    sign_declare: false,
    telegram_user: "",
  };

  const [formData, setFormData] = useState(initFormData);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      await actions.users.getAll();
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddUser = () => {
    setFormData(initFormData);
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role_id: user.role_id,
      status: user.status,
      sign_declare: user.sign_declare,
      telegram_user: user.telegram_user || "",
    });
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      actions.users
        .update(editingUser.id, formData)
        .then(() => {
          setIsModalVisible(false);
          setEditingUser(null);
        })
        .catch((err) => console.error("Error updating user:", err));
    } else {
      actions.users
        .create(formData)
        .then(() => {
          setIsModalVisible(false);
        })
        .catch((err) => console.error("Error creating user:", err));
    }
  };

  const handleDeleteUser = (id) => {
    actions.users
      .delete(id)
      .then(() => {
        setShowActions(null);
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  if (loading && !refreshing) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Nuevo Usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
        }
        renderItem={({ item }) => (
          <UserItem
            item={item}
            showActions={showActions}
            toggleActions={toggleActions}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay usuarios registrados</Text>
          </View>
        )}
      />

      <CreateUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveUser}
        isEditing={!!editingUser}
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
  itemStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  inactiveBadge: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  telegramBadge: {
    fontSize: 12,
    color: "#0288d1",
    backgroundColor: "#e1f5fe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
});

export default UsersView;
