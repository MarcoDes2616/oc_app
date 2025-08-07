import { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AppContext } from '../context/AppContext';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const menuItems = [
  { 
    screen: 'Settings', 
    icon: 'cog',
    roles: [1, 2],
    color: '#6366f1'
  },
  { 
    screen: 'ProfileMain', 
    icon: 'account',
    roles: [1, 2],
    color: '#10b981'
  },
  { 
    screen: 'Admin', 
    icon: 'shield-account',
    roles: [1],
    color: '#ef4444'
  }
];

const ProfileMenu = () => {
  const navigation = useNavigation();
  const { user } = useContext(AppContext); 

  return (
   <View style={styles.container}>
      <View style={styles.menuCard}>
        {menuItems.map((item) => {
          // if (!item.roles.includes(user?.roleId)) return null;
          
          return (
            <TouchableOpacity 
              key={item.screen}
              style={[styles.iconButton, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileMenu;