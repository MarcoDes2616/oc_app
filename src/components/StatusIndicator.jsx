import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

// Componente reutilizable para el indicador
const StatusIndicator = ({ statusId, showLabel = false }) => {
    
        const statusList = [
        { signal_status_name: "Activa" },
        { signal_status_name: "Inactiva" },
        { signal_status_name: "Completada" },
        { signal_status_name: "Cancelada" },
        { signal_status_name: "Pendiente" },
        { signal_status_name: "Fallida" },
        { signal_status_name: "Programada" },
      ]
    
      // Primero, define los colores e íconos para cada estado
    const getStatusConfig = (statusId) => {
      const statusConfig = {
        1: { // Activa
          color: '#4CAF50', // Verde
          icon: 'play-circle', // o 'check-circle', 'flash-on'
          bgColor: '#E8F5E9',
          label: 'Activa'
        },
        2: { // Inactiva
          color: '#9E9E9E', // Gris
          icon: 'pause-circle', // o 'remove-circle'
          bgColor: '#F5F5F5',
          label: 'Inactiva'
        },
        3: { // Completada
          color: '#2196F3', // Azul
          icon: 'check-circle', // o 'done-all'
          bgColor: '#E3F2FD',
          label: 'Completada'
        },
        4: { // Cancelada
          color: '#FF9800', // Naranja/Ámbar
          icon: 'cancel', // o 'block'
          bgColor: '#FFF3E0',
          label: 'Cancelada'
        },
        5: { // Pendiente (tu caso: id=5)
          color: '#FFC107', // Amarillo
          icon: 'schedule', // o 'access-time'
          bgColor: '#FFFDE7',
          label: 'Pendiente'
        },
        6: { // Fallida
          color: '#F44336', // Rojo
          icon: 'error', // o 'warning'
          bgColor: '#FFEBEE',
          label: 'Fallida'
        },
        7: { // Programada
          color: '#9C27B0', // Púrpura
          icon: 'calendar-today', // o 'event'
          bgColor: '#F3E5F5',
          label: 'Programada'
        }
      };
      
      return statusConfig[statusId] || {
        color: '#757575',
        icon: 'help',
        bgColor: '#F5F5F5',
        label: 'Desconocido'
      };
    };
  
    const config = getStatusConfig(statusId);
  
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
      {showLabel && (
        <Text style={[styles.statusLabel, { color: config.color }]}>
          {config.label}
        </Text>
      )}
      <MaterialIcons name={config.icon} size={16} color={config.color} />
    </View>
  );
};


export default StatusIndicator;
// Estilos para el badge
const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 60,
    marginTop: -4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});