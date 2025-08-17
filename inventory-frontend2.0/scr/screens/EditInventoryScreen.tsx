import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { InventoryItem, UpdateInventoryItemRequest } from '../types';
import { updateInventory, getInventories } from '../services/inventoryService';

const EditInventoryScreen = ({ route, navigation }: any) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const itemId = route.params.itemId || (route.params.item ? route.params.item._id : null);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        if (route.params.item) {
          const foundItem = route.params.item;
          setItem(foundItem);
          setName(foundItem.name);
          setQuantity(foundItem.quantity.toString());
          setCategory(foundItem.category);
        } else if (itemId) {
          const inventories = await getInventories();
          const foundItem = inventories.find((i: InventoryItem) => i._id === itemId);
          if (foundItem) {
            setItem(foundItem);
            setName(foundItem.name);
            setQuantity(foundItem.quantity.toString());
            setCategory(foundItem.category);
          } else {
            Alert.alert('Error', 'No encontramos el producto');
            navigation.goBack();
          }
        }
      } catch (err) {
        Alert.alert('Error', 'Hubo un problema al cargar el producto');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [itemId, route.params.item]);

  const handleUpdate = async () => {
    if (!name || !quantity || !category || !itemId) {
      Alert.alert('Atención', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(parseInt(quantity))) {
      Alert.alert('Atención', 'La cantidad debe ser un número');
      return;
    }

    try {
      setIsLoading(true);
      const payload: UpdateInventoryItemRequest = {
        name,
        quantity: parseInt(quantity, 10),
        category,
      };

      await updateInventory(itemId, payload);
      Alert.alert('Listo', 'Los cambios se guardaron correctamente');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', 'No pudimos guardar los cambios. Por favor intenta nuevamente.');
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del producto</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Editar Producto</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Nombre del Producto</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Leche entera"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Cantidad en Stock</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Ej: 25"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Tipo de Producto</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Ej: Lácteos"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => navigation.navigate('ProductHistory', { productId: item._id, name: item.name })}
        >
          <Text style={styles.historyButtonText}>Ver Historial Completo</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditInventoryScreen;