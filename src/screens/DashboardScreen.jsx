import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';

// 📊 Data fake
const operations = [
  {
    id: 1,
    signal_id: 101,
    operation_type_id: 1,
    instrument_id: 10,
    entry_point: 1.2345,
    exit_point: 1.2400,
    lote: 0.5,
    profit: 50,
    is_successful: true,
  },
  {
    id: 2,
    signal_id: 102,
    operation_type_id: 2,
    instrument_id: 12,
    entry_point: 1.1000,
    exit_point: 1.0950,
    lote: 0.3,
    profit: -30,
    is_successful: false,
  },
  {
    id: 3,
    signal_id: 103,
    operation_type_id: 1,
    instrument_id: 11,
    entry_point: 1.5000,
    exit_point: 1.5100,
    lote: 1,
    profit: 100,
    is_successful: true,
  },
];

// 🔼 Valores resumen fake
const stats = {
  totalProfit: operations.reduce((acc, op) => acc + Number(op.profit), 0),
  totalOps: operations.length,
  successCount: operations.filter(op => op.is_successful).length,
};

const DashboardScreen = () => {
  const renderOperation = ({ item }) => {
    return (
      <Card style={[styles.operationCard, item.is_successful ? styles.success : styles.failure]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Instrumento ID: {item.instrument_id}</Text>
          <Text>Entrada: {item.entry_point}</Text>
          <Text>Salida: {item.exit_point}</Text>
          <Text>Lote: {item.lote}</Text>
          <Text>Ganancia: ${item.profit.toFixed(2)}</Text>
          <Text style={styles.status}>
            {item.is_successful ? '✅ Exitosa' : '❌ Fallida'}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔝 Sección Dashboard */}
      <View style={styles.dashboard}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text>Total Operaciones: {stats.totalOps}</Text>
        <Text>Éxitos: {stats.successCount}</Text>
        <Text>Ganancia Total: ${stats.totalProfit.toFixed(2)}</Text>
        {/* 📈 Aquí podrías incluir un gráfico de barras o de líneas más adelante */}
        <Divider style={{ marginVertical: 10 }} />
      </View>

      {/* 📃 Libro de Operaciones */}
      <Text style={styles.sectionTitle}>Libro de operaciones</Text>
      <FlatList
        data={operations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOperation}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dashboard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  operationCard: {
    marginBottom: 12,
    borderLeftWidth: 5,
  },
  success: {
    backgroundColor: '#e6f8ec',
    borderLeftColor: '#4CAF50',
  },
  failure: {
    backgroundColor: '#ffe6e6',
    borderLeftColor: '#F44336',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
