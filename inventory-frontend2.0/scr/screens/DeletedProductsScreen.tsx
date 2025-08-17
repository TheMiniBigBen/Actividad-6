// src/screens/DeletedProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getDeletedProducts } from '../services/inventoryService';

const DeletedProductsScreen = () => {
  const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeletedItems = async () => {
    try {
      const data = await getDeletedProducts();
      setDeletedItems(data);
    } catch (error) {
      console.error("Failed to load deleted items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedItems();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const product = item.details?.deletedProduct;
    if (!product) return null;
    return (
      <View style={styles.item}>
        <Text style={styles.itemName}>🗑️ {product.name}</Text>
        <Text style={styles.itemDetail}>Cantidad: {product.quantity}</Text>
        <Text style={styles.itemDetail}>Categoría: {product.category}</Text>
        <Text style={styles.dateText}>Eliminado el: {new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    );
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
      <Text style={styles.title}>Productos Eliminados</Text>
      <FlatList
        data={deletedItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No hay productos eliminados registrados.</Text>
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
  },
  dateText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'right',
  }
});

export default DeletedProductsScreen;