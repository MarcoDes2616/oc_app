import {
  View,
  Text, // Added missing import
  FlatList,
  RefreshControl,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SignalItem from "./SignalItem";

const SignalsListView = ({
  selectedProject,
  signals,
  lists,
  refreshing,
  onRefresh,
  onBack,
  hideActions,
  setFilterStatus,
  filterStatus,
  toggleActions,
  onDelete,
  onEdit,
  showActions

}) => {
  return (
    <View style={styles.container}>
      <View style={styles.projectHeader}>
        {onBack && <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#6200ee" />
        </Pressable>}
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>
            {selectedProject.project_name}
          </Text>
          <Text style={styles.projectDates}>
            {new Date(selectedProject.init_date).toLocaleDateString()} -
            {selectedProject.end_date
              ? new Date(selectedProject.end_date).toLocaleDateString()
              : " Presente"}
          </Text>
        </View>
      </View>

      {/* Filtros por estado */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        <Pressable
          style={[styles.filterButton, !filterStatus && styles.activeFilter]}
          onPress={() => setFilterStatus(null)}
        >
          <Text>Todas</Text>
        </Pressable>

        {lists.signalStatus?.map((status) => (
          <Pressable
            key={status.id}
            style={[
              styles.filterButton,
              filterStatus === status.id && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus(status.id)}
          >
            <Text>{status.signal_status_name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Lista de señales */}
      <FlatList
        data={signals}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SignalItem
            item={item}
            lists={lists}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
            toggleActions={toggleActions}
            hideActions={hideActions}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay señales disponibles</Text>
            <Text style={styles.emptySubtext}>
              Para el proyecto seleccionado
            </Text>
          </View>
        )}
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
    height: 46,
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

export default SignalsListView;
