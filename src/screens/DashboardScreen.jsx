import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="construction" size={80} color="#FFA500" />
        <Text style={styles.title}>Dashboard en Construcción</Text>
        <Text style={styles.subtitle}>Estamos trabajando en esta sección</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>65% completado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  progressContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '65%',
    backgroundColor: '#FFA500',
  },
  progressText: {
    marginTop: 8,
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
