import { useState } from "react";
import { Pressable, Text, View, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;

const InterestArea = ({ item }) => {
  const [expandedInterest, setExpandedInterest] = useState(false);

  // Determinar si es compra (1) o venta (2)
  const isBuy = item.operation_type_id === 1;
  const operationType = isBuy ? "COMPRA" : "VENTA";
  
  // Precios
  const minPrice = parseFloat(item.price_range_min) || 0;
  const maxPrice = parseFloat(item.price_range_max) || 0;
  const entryPoint = parseFloat(item.entry_point) || 0;
  const stopLoss = parseFloat(item.sl_price) || 0;
  const takeProfit = parseFloat(item.expected_target) || 0;
  
  const hasValidData = minPrice > 0 && maxPrice > 0 && entryPoint > 0;
  const priceRange = maxPrice - minPrice;

  // Colores basados en el tipo de operación
  const zoneColor = isBuy ? '#4CAF50' : '#F44336'; // Verde para compra, rojo para venta
  const entryLineColor = isBuy ? '#2E7D32' : '#C62828'; // Verde oscuro/rojo oscuro
  const textColor = isBuy ? '#1B5E20' : '#B71C1C';

  return (
    <>
      <Pressable 
        style={styles.accordionHeader}
        onPress={() => setExpandedInterest(!expandedInterest)}
      >
        <Text style={styles.accordionTitle}>Zona de interés - {operationType}</Text>
        <MaterialIcons
          name={expandedInterest ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#757575"
        />
      </Pressable>

      {expandedInterest && (
        <View style={styles.accordionContent}>
          {hasValidData ? (
            <View style={styles.chartContainer}>
              <Text style={[styles.chartTitle, { color: textColor }]}>
                Zona de {isBuy ? 'compra' : 'venta'}
              </Text>
              
              <View style={styles.chart}>
                {/* Línea de precio máximo */}
                <View style={styles.priceLevel}>
                  <Text style={styles.priceLabel}>{maxPrice.toFixed(2)}</Text>
                  <View style={styles.priceLine} />
                </View>

                {/* Zona de interés */}
                <View style={[
                  styles.interestZone, 
                  { 
                    backgroundColor: zoneColor,
                    height: 40, // Altura fija para mejor visualización
                  }
                ]}>
                  <Text style={styles.zoneLabel}>ZONA DE {operationType}</Text>
                </View>

                {/* Línea de entrada */}
                <View style={styles.priceLevel}>
                  <Text style={styles.priceLabel}>{entryPoint.toFixed(2)}</Text>
                  <View style={[
                    styles.priceLine, 
                    styles.entryLine,
                    { backgroundColor: entryLineColor }
                  ]} />
                </View>

                {/* Línea de precio mínimo */}
                <View style={styles.priceLevel}>
                  <Text style={styles.priceLabel}>{minPrice.toFixed(2)}</Text>
                  <View style={styles.priceLine} />
                </View>
              </View>

              {/* Información de la operación */}
              <View style={styles.operationInfo}>
                <View style={[styles.operationBadge, { backgroundColor: zoneColor }]}>
                  <Text style={styles.operationText}>{operationType}</Text>
                </View>
                <Text style={[styles.riskText, { color: textColor }]}>
                  Riesgo: {stopLoss > 0 ? Math.abs(entryPoint - stopLoss).toFixed(2) : 'N/A'} pips
                </Text>
                <Text style={[styles.rewardText, { color: textColor }]}>
                  Tp: {takeProfit > 0 ? Math.abs(takeProfit - entryPoint).toFixed(2) : 'N/A'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No hay datos suficientes para mostrar la zona de interés</Text>
          )}

          {/* Datos numéricos detallados */}
          <View style={styles.numericData}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Operación:</Text>
              <Text style={[styles.dataValue, { color: zoneColor }]}>
                {operationType}
              </Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rango máximo:</Text>
              <Text style={styles.dataValue}>{maxPrice.toFixed(4)}</Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Precio de entrada:</Text>
              <Text style={[styles.dataValue, { color: entryLineColor }]}>
                {entryPoint.toFixed(4)}
              </Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rango mínimo:</Text>
              <Text style={styles.dataValue}>{minPrice.toFixed(4)}</Text>
            </View>

            {stopLoss > 0 && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Stop Loss:</Text>
                <Text style={[styles.dataValue, { color: '#FF6B6B' }]}>
                  {stopLoss.toFixed(4)}
                </Text>
              </View>
            )}

            {takeProfit > 0 && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Take Profit:</Text>
                <Text style={[styles.dataValue, { color: '#66BB6A' }]}>
                  pips {takeProfit.toFixed(4)}
                </Text>
              </View>
            )}

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rango de zona:</Text>
              <Text style={styles.dataValue}>pips {priceRange.toFixed(4)}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: "600",
    color: "#333",
  },
  accordionContent: {
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    height: 180,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'right',
  },
  priceLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
    marginLeft: 0,
  },
  entryLine: {
    height: 3,
  },
  interestZone: {
    width: CHART_WIDTH - 120,
    alignSelf: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  zoneLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  operationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
  },
  operationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  operationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  numericData: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  dataLabel: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});

export default InterestArea;
