// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
}

// Mock del store de inventario (reemplaza con tu store real si lo tienes)
const useInventoryStore = () => ({
  totalItems: 100,
  criticalItems: [
    { _id: '1', name: 'Producto A', quantity: 2 },
    { _id: '2', name: 'Producto B', quantity: 4 },
  ],
});

const DashboardScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuthStore() || { user: { name: 'Usuario' } };
  const { totalItems = 0, criticalItems = [] } = useInventoryStore() || {};

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <Text>- {item.name} ({item.quantity})</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Inventario</Text>
      <Text>Bienvenido, {user?.name || 'Usuario'}!</Text>
      <Text>Total de productos en stock: {totalItems}</Text>

      <Text style={styles.subtitle}>Productos críticos (≤5):</Text>
      {criticalItems.length === 0 ? (
        <Text>¡Todo en buen nivel!</Text>
      ) : (
        <FlatList
          data={criticalItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}

      <Button
        title="Ver Inventario Completo"
        onPress={() => navigation.navigate('Inventory')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
});

export default DashboardScreen;
