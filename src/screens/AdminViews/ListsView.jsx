import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useData } from "../../context/DataContext";
import { MaterialIcons } from "@expo/vector-icons";

const initFormData = {
  instrument_name: "",
  market_id: null,
};

const ListsView = () => {
  const { lists, actions } = useData();
  const [activeTab, setActiveTab] = useState("instruments");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [formData, setFormData] = useState(initFormData);
  const [showActions, setShowActions] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // CRUD Operations
  const handleAddInstrument = () => {
    setEditingInstrument(null);
    setFormData(initFormData);
    setIsModalVisible(true);
  };

  const handleSaveInstrument = () => {
    if (editingInstrument) {
      actions.instruments.update(editingInstrument.id, formData);
    } else {
      actions.instruments.create(formData);
    }
    setIsModalVisible(false);
  };

  const handleDeleteInstrument = (id) => {
    actions.instruments.delete(id);
    setShowActions(null);
  };

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  const renderMarket = (item) => {
    let market = lists.markets.find((market) => market.id === item.market_id);
    return <Text>{market && market.market_name}</Text>;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>
          {item.instrument_name ||
            item.market_name ||
            item.operation_type_name ||
            item.signal_status_name}
        </Text>

        {activeTab === "instruments" && (
          <>
            <View>{renderMarket(item)}</View>
            <View style={styles.actionsWrapper}>
              <Pressable onPress={() => toggleActions(item.id)}>
                <MaterialIcons name="more-vert" size={24} color="#757575" />
              </Pressable>

              {showActions === item.id && (
                <View style={styles.actionsMenu}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDeleteInstrument(item.id)}
                  >
                    <MaterialIcons name="delete" size={18} color="#ff0000" />
                    <Text style={[styles.actionText, { color: "#ff0000" }]}>
                      Eliminar
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  const fetchInstruments = async () => {
    setRefreshing(true);
    try {
      await actions.instruments.getAll();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  // if (loading && !refreshing) return <ActivityIndicator size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listas</Text>

      {/* Pestañas scrollables */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {Object.keys(lists).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.activeTab]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={activeTab === key && styles.activeTabText}>
              {key === "instruments" && "Instrumentos"}
              {key === "markets" && "Mercados"}
              {key === "operationsTypes" && "Operaciones"}
              {key === "signalStatus" && "Estados"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botón de agregar solo para instrumentos */}
      {activeTab === "instruments" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddInstrument}
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Agregar Instrumento</Text>
        </TouchableOpacity>
      )}

      {/* Lista de items */}
      <FlatList
        data={lists[activeTab]}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchInstruments}
          />
        }
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
      />

      {/* Modal mejorado */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingInstrument ? "Editar Instrumento" : "Nuevo Instrumento"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del instrumento"
              value={formData.instrument_name}
              onChangeText={(text) => setFormData({...formData, instrument_name: text})}
              autoFocus
            />

            <Text style={styles.inputLabel}>Mercado *</Text>
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveInstrument}
                disabled={!formData.instrument_name || !formData.market_id}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#ffffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabsContainer: {
    paddingBottom: 10,
    marginBottom: 16,
    height: 50,
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
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  activeTab: {
    backgroundColor: "#6200ee",
  },
  activeTabText: {
    color: "white",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  actionsWrapper: {
    position: "relative",
  },
  actionsMenu: {
    position: "absolute",
    right: 20,
    top: -10,
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
    color: "#6200ee",
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
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default ListsView;
