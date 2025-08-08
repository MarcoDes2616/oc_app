import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ViewSelectorButton = ({ 
  icon, 
  label, 
  isActive, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={isActive ? '#6200ee' : '#757575'} 
      />
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8
  },
  activeButton: {
    backgroundColor: '#f3e5ff'
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: '#757575'
  },
  activeLabel: {
    color: '#6200ee',
    fontWeight: '600'
  }
});

export default ViewSelectorButton;