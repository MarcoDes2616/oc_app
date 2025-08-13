import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const UserItem = ({ 
  item, 
  showActions, 
  toggleActions, 
  handleEditUser, 
  handleDeleteUser 
}) => {
  const { handleOpenTelegram } = useData();


  
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.firstname} {item.lastname}</Text>
        <Text style={styles.itemSubtitle}>{item.email}</Text>
        <View style={styles.itemStatusContainer}>
          <Text style={[
            styles.statusBadge,
            item.status ? styles.activeBadge : styles.inactiveBadge
          ]}>
            {item.status ? 'Activo' : 'Inactivo'}
          </Text>
          {item.telegram_user && (
            <Pressable 
              style={styles.telegramContainer}
              onPress={() => handleOpenTelegram(item)}
            >
              <FontAwesome name="telegram" size={16} color="#0088cc" />
              <Text style={styles.telegramText}>
                {item.telegram_user}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      
      <Pressable onPress={() => toggleActions(item.id)}>
        <MaterialIcons name="more-vert" size={24} color="#757575" />
      </Pressable>

      {showActions === item.id && (
        <View style={styles.actionsMenu}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => handleEditUser(item)}
          >
            <MaterialIcons name="edit" size={18} color="#6200ee" />
            <Text style={styles.actionText}>Editar</Text>
          </Pressable>
          <Pressable 
            style={styles.actionButton}
            onPress={() => handleDeleteUser(item.id)}
          >
            <MaterialIcons name="delete" size={18} color="#ff0000" />
            <Text style={[styles.actionText, { color: "#ff0000" }]}>Eliminar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  telegramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  telegramText: {
    fontSize: 12,
    color: '#0088cc',
    marginLeft: 4,
  },
  actionsMenu: {
    position: 'absolute',
    right: 40,
    top: 10,
    backgroundColor: '#ffffffc0',
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
  telegramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden', // Para el efecto ripple en Android
  },
  telegramText: {
    fontSize: 12,
    color: '#0088cc',
    marginLeft: 4,
    marginRight: 4,
  },
  externalIcon: {
    marginLeft: 2,
  },
});

export default UserItem;