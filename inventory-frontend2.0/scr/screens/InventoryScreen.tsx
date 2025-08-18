// src/screens/InventoryScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { getInventories, deleteInventory } from '../services/inventoryService';
import { useIsFocused } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  category: string;
  qrCodeData?: string;
  createdAt: string;
}

const InventoryScreen = ({ navigation }: any) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const qrRefs = useRef<{ [key: string]: any }>({}); // Referencia para el QR visible
  const shareableQrRefs = useRef<{ [key: string]: any }>({}); // Referencia para el QR a capturar
  const hasAlertBeenShown = useRef(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadInventories();
    setRefreshing(false);
  }, []);

  const loadInventories = async () => {
    try {
      setLoading(true);
      const data = await getInventories();
      setItems(data);
    } catch (err) {
      console.error("Failed to load inventories:", err);
      if (!hasAlertBeenShown.current) {
        Alert.alert('Error', 'No se pudo cargar el inventario. Por favor, revisa tu conexión.');
        hasAlertBeenShown.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadInventories();
      hasAlertBeenShown.current = false;
    }
  }, [isFocused]);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteInventory(id);
              Alert.alert('Éxito', 'Producto eliminado');
              setItems(items.filter(item => item._id !== id));
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const captureAndShareQR = async (id: string) => {
    try {
      // Usamos la referencia del contenedor invisible para la captura
      const qrRef = shareableQrRefs.current[id];
      if (!qrRef) throw new Error('Referencia no encontrada para el QR.');

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1.0,
      });

      if (!uri) throw new Error('Captura de URI fallida.');

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Compartir QR de ${items.find(item => item._id === id)?.name || 'Producto'}`,
      });

    } catch (error) {
      console.error('Error al compartir QR:', error);
      Alert.alert('Error', 'No se pudo compartir el código QR.');
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.item}>
      {/* Contenido para mostrar en la lista (tu diseño original) */}
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemText}>Cantidad: {item.quantity}</Text>
      <Text style={styles.itemText}>Categoría: {item.category}</Text>
      <Text style={styles.itemText}>Creado: {new Date(item.createdAt).toLocaleDateString()}</Text>

      <View style={styles.qrSection}>
        <View
          style={styles.qrContainer}
          ref={ref => { qrRefs.current[item._id] = ref; }}
          collapsable={false}
        >
          <QRCode
            value={`prod:${item._id}`}
            size={120}
            color="#000000"
            backgroundColor="#FFFFFF"
            quietZone={15}
            ecl="H"
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, styles.shareButton, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() => captureAndShareQR(item._id)}
        >
          <Text style={styles.buttonText}>Compartir QR</Text>
        </Pressable>
      </View>

      <View style={styles.itemButtons}>
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: '#3498db', opacity: pressed ? 0.8 : 1 }]}
          onPress={() => navigation.navigate('EditInventory', { item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: '#e74c3c', opacity: pressed ? 0.8 : 1 }]}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: '#2ecc71', opacity: pressed ? 0.8 : 1 }]}
          onPress={() => navigation.navigate('ProductHistory', { productId: item._id, name: item.name })}
        >
          <Text style={styles.buttonText}>Historial</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <View style={styles.headerButtons}>
      <Pressable
        style={({ pressed }) => [styles.createButton, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => navigation.navigate('CreateInventory')}
      >
        <Text style={styles.createButtonText}>Crear Producto</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.scanButton, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => navigation.navigate('ScanQRCode')}
      >
        <Text style={styles.createButtonText}>Escanear QR</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.deletedButton, { opacity: pressed ? 0.8 : 1 }]}
        onPress={() => navigation.navigate('DeletedProducts')}
      >
        <Text style={styles.createButtonText}>Eliminados</Text>
      </Pressable>
    </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text>No hay productos en tu inventario.</Text>
            </View>
          )
        }
      />

      {/* Contenedores de QR invisibles para la captura */}
      {items.map(item => (
        <View
          key={`shareable-${item._id}`}
          style={styles.shareableContentContainer}
          ref={ref => {
            if (ref) {
              shareableQrRefs.current[item._id] = ref;
            }
          }}
          collapsable={false}
        >
          <Text style={styles.nameInQr}>Producto:{item.name}</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={`prod:${item._id}`}
              size={180}
              color="#000000"
              backgroundColor="#FFFFFF"
              quietZone={10}
              ecl="H"
            />
          </View>
          <Text style={styles.detailsInQr}>
           Categoría: {item.category}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletedButton: {
  flex: 1,
  backgroundColor: '#ff0000ff', // un rojo para diferenciarlo
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginLeft: 5,
},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
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
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#f39c12',
    marginTop: 10,
    width: '50%',
  },
  // Contenedor de captura invisible y estilizado
  shareableContentContainer: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nameInQr: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  detailsInQr: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default InventoryScreen;