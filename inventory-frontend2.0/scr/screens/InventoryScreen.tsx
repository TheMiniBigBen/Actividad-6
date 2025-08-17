import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  StyleSheet, 
  Alert, 
  RefreshControl, 
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { getInventories, deleteInventory } from '../services/inventoryService';
import { useIsFocused } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  category: string;
  createdAt: string;
}

const InventoryScreen = ({ navigation }: any) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const qrRefs = useRef<{ [key: string]: any }>({});
  const shareableQrRefs = useRef<{ [key: string]: any }>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
      Alert.alert('Error', 'No se pudo cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadInventories();
    }
  }, [isFocused]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteInventory(id);
              setItems(items.filter(item => item._id !== id));
              Alert.alert('Éxito', 'Producto eliminado');
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const captureAndShareQR = async (id: string) => {
    try {
      const qrRef = shareableQrRefs.current[id];
      if (!qrRef) return;

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1.0,
      });

      if (!uri) return;

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Código QR de ${items.find(item => item._id === id)?.name || 'Producto'}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el código QR');
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemHeader}
        onPress={() => toggleExpand(item._id)}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Disponible: {item.quantity}</Text>
        </View>
        <Icon 
          name={expandedItem === item._id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#7F8C8D" 
        />
      </TouchableOpacity>

      {expandedItem === item._id && (
        <View style={styles.expandedContent}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="category" size={16} color="#7F8C8D" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="calendar-today" size={16} color="#7F8C8D" />
              <Text style={styles.detailText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={`prod:${item._id}`}
              size={120}
              color="#2C3E50"
              backgroundColor="#FFFFFF"
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate('EditInventory', { item })}
            >
              <Icon name="edit" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.historyButton]}
              onPress={() => navigation.navigate('ProductHistory', { 
                productId: item._id, 
                name: item.name 
              })}
            >
              <Icon name="history" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton]}
              onPress={() => captureAndShareQR(item._id)}
            >
              <Icon name="share" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Compartir</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item._id)}
            >
              <Icon name="delete" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateInventory')}
          >
            <Icon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('ScanQRCode')}
          >
            <Icon name="qr-code-scanner" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#4A90E2']}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="inventory" size={50} color="#BDC3C7" />
              <Text style={styles.emptyText}>No hay productos en el inventario</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('CreateInventory')}
              >
                <Text style={styles.emptyButtonText}>Agregar Producto</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      {/* QR containers for sharing (hidden) */}
      {items.map(item => (
        <View
          key={`shareable-${item._id}`}
          style={styles.shareableContentContainer}
          ref={ref => { shareableQrRefs.current[item._id] = ref; }}
          collapsable={false}
        >
          <Text style={styles.nameInQr}>{item.name}</Text>
          <QRCode
            value={`prod:${item._id}`}
            size={180}
            color="#2C3E50"
            backgroundColor="#FFFFFF"
          />
          <Text style={styles.detailsInQr}>
            Categoría: {item.category} • Cantidad: {item.quantity}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECEE',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#2ecc71',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#7F8C8D',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  expandedContent: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#EAECEE',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAECEE',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 5,
    flex: 1,
    minWidth: '48%',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  historyButton: {
    backgroundColor: '#9b59b6',
  },
  shareButton: {
    backgroundColor: '#f39c12',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  shareableContentContainer: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
  },
  nameInQr: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
    textAlign: 'center',
  },
  detailsInQr: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default InventoryScreen;