// src/screens/CreateInventoryScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CreateInventoryItemRequest, InventoryItem } from '../types';
import { createInventory } from '../services/inventoryService';

const CreateInventoryScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !quantity || !category) {
      Alert.alert('Campos requeridos', 'Por favor completa toda la información del producto');
      return;
    }

    if (isNaN(parseInt(quantity))) {
      Alert.alert('Valor incorrecto', 'La cantidad debe ser un número');
      return;
    }

    try {
      setIsLoading(true);
      const newItem: CreateInventoryItemRequest = {
        name,
        quantity: parseInt(quantity, 10),
        category,
      };
      const created: InventoryItem = await createInventory(newItem);
      Alert.alert('Producto creado', `"${created.name}" se agregó al inventario`);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo crear el producto. Revisa la conexión y los permisos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Producto</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Nombre del Producto</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ej: Leche entera 1L"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Cantidad Inicial</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 20"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Lácteos"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar Producto</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
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
});

export default CreateInventoryScreen;