import { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  Clipboard,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import AccessToMT5btn from "./AccessToMT5btn";
import InterestArea from "./InterestArea";
import { AppContext } from "../context/AppContext";

const SignalItem = ({
  item,
  lists,
  onEdit,
  onDelete,
  showActions,
  toggleActions,
  hideActions,
}) => {
  const { user } = useContext(AppContext);
  const takersIds = item.takenBy?.map((t) => t.id) || [];
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [expandedImage, setExpandedImage] = useState(false);
  const [takingSignal, setTakingSignal] = useState(false);
  const [isSignalTaken, setIsSignalTaken] = useState(
    takersIds.includes(user?.id)
  );
  const { openMT5WithParameters, actions } = useData();

  const status = lists.signalStatus?.find(
    (s) => s.id === item.signal_status_id
  );
  const instrument = lists.instruments?.find(
    (i) => i.id === item.instrument_id
  );
  const operation = lists.operationsTypes?.find(
    (o) => o.id === item.operation_type_id
  );

  const handleTakeSignal = async () => {
    try {
      setTakingSignal(true);
      await actions.signals.takeSignal(item.id);
      setIsSignalTaken(true);
      Alert.alert("Éxito", "Has confirmado que tomaste esta señal");
    } catch (error) {
      Alert.alert("Error", "No se pudo confirmar la señal");
    } finally {
      setTakingSignal(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    Clipboard.setString(text.toString());
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isValidUrl = (url) => {
    return (
      typeof url === "string" &&
      (url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("file://"))
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.instrumentText}>
          {instrument?.instrument_name} - {operation?.operation_type_name}
        </Text>
        <Text
          style={[styles.statusText, { color: status?.color || "#757575" }]}
        >
          {status?.signal_status_name}
        </Text>
      </View>

      {/* Botón MT5 */}
      {hideActions && (
        <AccessToMT5btn openMT5WithParameters={openMT5WithParameters} />
      )}

      {/* Valores copiables */}
      <View style={styles.valuesContainer}>
        <Pressable
          style={styles.valueItem}
          onPress={() => copyToClipboard(item.entry_point, "entry")}
        >
          <Text style={styles.valueLabel}>Entrada:</Text>
          <View style={styles.valueContent}>
            <Text style={styles.valueText}>{item.entry_point || "N/A"}</Text>
            <MaterialIcons
              name="content-copy"
              size={16}
              color="#6200ee"
              style={styles.copyIcon}
            />
            {copiedField === "entry" && (
              <Text style={styles.copiedText}>Copiado!</Text>
            )}
          </View>
        </Pressable>

        <Pressable
          style={styles.valueItem}
          onPress={() => copyToClipboard(item.sl_price, "sl")}
        >
          <Text style={styles.valueLabel}>SL:</Text>
          <View style={styles.valueContent}>
            <Text style={styles.valueText}>{item.sl_price || "N/A"}</Text>
            <MaterialIcons
              name="content-copy"
              size={16}
              color="#6200ee"
              style={styles.copyIcon}
            />
            {copiedField === "sl" && (
              <Text style={styles.copiedText}>Copiado!</Text>
            )}
          </View>
        </Pressable>

        <Pressable
          style={styles.valueItem}
          onPress={() => copyToClipboard(item.expected_target, "target")}
        >
          <Text style={styles.valueLabel}>Target:</Text>
          <View style={styles.valueContent}>
            <Text style={styles.targetText}>
              {item.expected_target || "N/A"}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Botón "He tomado esta señal" */}
      {hideActions && !isSignalTaken && (
        <Pressable
          style={styles.takeSignalButton}
          onPress={handleTakeSignal}
          disabled={takingSignal}
        >
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.takeSignalText}>
            {takingSignal ? "Confirmando..." : "Tomar esta señal"}
          </Text>
        </Pressable>
      )}

      {isSignalTaken && (
        <View style={styles.signalTakenBadge}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.signalTakenText}>Señal tomada</Text>
        </View>
      )}

      {/* Zona de interés - Acordeón */}
      {hideActions && <InterestArea item={item} />}

      {/* Imagen - Acordeón */}
      {isValidUrl(item.image_reference) && (
        <>
          <Pressable
            style={styles.accordionHeader}
            onPress={() => setExpandedImage(!expandedImage)}
          >
            <Text style={styles.accordionTitle}>Imagen de referencia</Text>
            <MaterialIcons
              name={expandedImage ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#757575"
            />
          </Pressable>

          {expandedImage && (
            <View style={styles.accordionContent}>
              <Pressable onPress={() => setFullscreenImage(true)}>
                <Image
                  source={{ uri: item.image_reference }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          )}

          <Modal
            visible={fullscreenImage}
            transparent={true}
            onRequestClose={() => setFullscreenImage(false)}
          >
            <Pressable
              style={styles.fullscreenContainer}
              onPress={() => setFullscreenImage(false)}
            >
              <Image
                source={{ uri: item.image_reference }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </Pressable>
          </Modal>
        </>
      )}

      {/* Menú de acciones */}
      {!hideActions ? (
        <Pressable
          style={styles.moreButton}
          onPress={() => toggleActions(item.id)}
        >
          <MaterialIcons name="more-vert" size={24} color="#757575" />
        </Pressable>
      ) : (
        <View style={styles.userCountContainer}>
          <MaterialIcons name="people" size={20} color="#757575" />
          <Text style={styles.userCountText}>{item.takenBy?.length || 0}</Text>
        </View>
      )}

      {showActions === item.id && (
        <View style={styles.actionsMenu}>
          <Pressable style={styles.actionButton} onPress={() => onEdit(item)}>
            <MaterialIcons name="edit" size={18} color="#6200ee" />
            <Text style={styles.actionText}>Editar</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => onDelete(item.id)}
          >
            <MaterialIcons name="delete" size={18} color="#ff0000" />
            <Text style={[styles.actionText, { color: "#ff0000" }]}>
              Eliminar
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3e5ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
   userCountContainer: {
    position: 'absolute',
    top: 10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginLeft: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  instrumentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusText: {
    fontSize: 14,
    marginRight: 55,
    fontWeight: "500",
  },
  takeSignalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  takeSignalText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  signalTakenBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  signalTakenText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "500",
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  valueItem: {
    flex: 1,
    marginRight: 8,
  },
  valueLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  valueContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
  },
  targetText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  copyIcon: {
    marginRight: 4,
  },
  copiedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontStyle: "italic",
    backgroundColor: "#E8F5E9",
    padding: 2,
    borderRadius: 4,
    zIndex: 1,
    position: "absolute",
    top: -20,
    left: 0,
    width: "100%",
    textAlign: "center",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 8,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  accordionContent: {
    marginBottom: 12,
  },
  zoneValues: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
  },
  zoneText: {
    fontSize: 14,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
  },
  moreButton: {
    position: "absolute",
    top: 16,
    right: 16,
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
});

export default SignalItem;
