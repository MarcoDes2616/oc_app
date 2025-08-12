import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileMenu from "../../components/ProfileMenu";
const avatar = require("../../../assets/default-avatar.png"); // Ruta de la imagen por defecto

const ProfileScreen = () => {
  const { user } = useContext(AppContext);
  const navigation = useNavigation();

  return (
    <>
      <ProfileMenu />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado con foto y nombre */}
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={100}
            source={user?.photo ? { uri: user?.photo } : avatar}
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {user?.firstname} {user?.lastname}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {user?.telegram_user && (
            <View style={styles.telegramContainer}>
              <MaterialIcons name="telegram" size={20} color="#0088cc" />
              <Text style={styles.telegramText}>@{user.telegram_user}</Text>
            </View>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Información de la cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>
              {user?.role_id === 1 ? "Administrador" : "Usuario"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Miembro desde:</Text>
            <Text style={styles.infoValue}>
              {new Date(user?.created_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View style={styles.statusBadge}>
              <Text
                style={user?.status ? styles.activeText : styles.inactiveText}
              >
                {user?.status ? "Activo" : "Inactivo"}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Acciones */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditProfile")}
            icon="account-edit"
          >
            Editar Perfil
          </Button>

          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => navigation.navigate("ChangePassword")}
            icon="lock-reset"
          >
            Cambiar Contraseña
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 45,
  },
  avatar: {
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  telegramContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  telegramText: {
    color: "#0088cc",
    marginLeft: 5,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 15,
    backgroundColor: "#eee",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: "#2e7d32",
    fontWeight: "500",
  },
  inactiveText: {
    color: "#c62828",
    fontWeight: "500",
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
    borderColor: "#6200ee",
  },
});

export default ProfileScreen;
