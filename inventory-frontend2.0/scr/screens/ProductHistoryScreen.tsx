// src/screens/ProductHistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getProductHistory } from '../services/inventoryService';

const ProductHistoryScreen = ({ route }: any) => {
  const { productId, name } = route.params;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getProductHistory(productId);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load product history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [productId]);

  const renderItem = ({ item }: { item: any }) => {
    const dateText = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Fecha no disponible';

    switch (item.action) {
      case 'created':
        const createdDetails = item.details?.createdWith || {};
        return (
          <View style={styles.item}>
            <Text style={styles.actionTitle}>✔️ Producto Creado</Text>
            <Text style={styles.detailText}>- Cantidad inicial: {createdDetails.quantity || 'No especificada'}</Text>
            <Text style={styles.detailText}>- Categoría: {createdDetails.category || 'No especificada'}</Text>
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        );
      case 'updated':
        const changes = item.details?.changes || {};
        const oldQuantity = item.details?.oldQuantity;
        const changeTexts = [];

        if (changes && typeof changes === 'object') {
          if ('name' in changes) {
            changeTexts.push(`Nombre cambiado a: ${changes.name}`);
          }
          if ('category' in changes) {
            changeTexts.push(`Categoría cambiada a: ${changes.category}`);
          }
          if ('quantity' in changes && typeof changes.quantity === 'number' && typeof oldQuantity === 'number') {
            const quantityChange = changes.quantity - oldQuantity;
            if (quantityChange > 0) {
              changeTexts.push(`Stock añadido: +${quantityChange}. Nueva cantidad: ${changes.quantity}`);
            } else if (quantityChange < 0) {
              changeTexts.push(`Stock quitado: ${Math.abs(quantityChange)}. Nueva cantidad: ${changes.quantity}`);
            }
          }
        }
        
        return (
          <View style={styles.item}>
            <Text style={styles.actionTitle}>✏️ Producto Actualizado</Text>
            {changeTexts.length > 0 ? (
              changeTexts.map((text, index) => (
                <Text key={index} style={styles.detailText}>- {text}</Text>
              ))
            ) : (
              <Text style={styles.detailText}>- Sin cambios detectados.</Text>
            )}
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        );
      case 'deleted':
        return (
          <View style={styles.item}>
            <Text style={styles.actionTitle}>🗑️ Producto Eliminado</Text>
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        );
      case 'quantity_change':
        const quantityDetails = item.details || {};
        const newQuantity = quantityDetails.newQuantity || 'No especificada';
        const type = quantityDetails.type || 'N/A';
        
        return (
          <View style={styles.item}>
            <Text style={styles.actionTitle}>📦 Cantidad cambiada</Text>
            <Text style={styles.detailText}>- Tipo: {type}</Text>
            <Text style={styles.detailText}>- Nueva cantidad: {newQuantity}</Text>
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.item}>
            <Text style={styles.actionTitle}>Acción desconocida</Text>
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial: {name}</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay historial para este producto.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333'
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    marginLeft: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default ProductHistoryScreen;