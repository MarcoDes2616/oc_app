import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";


const AccessToMT5btn = ({openMT5WithParameters}) => {
  return (
    <Pressable
      style={styles.mt5Button}
      onPress={() => openMT5WithParameters(item)}
    >
      <MaterialIcons name="launch" size={20} color="#43A047" />
      <Text style={styles.mt5ButtonText}>Configurar en MT5</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    mt5Button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  mt5ButtonText: {
    color: "#43A047",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default AccessToMT5btn;
