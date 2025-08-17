// src/screens/ScanQRCodeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { getInventories } from '../services/inventoryService';
import { InventoryItem } from '../types';

const ScanQRCodeScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  // Pedimos los permisos de la cámara al iniciar
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Manejamos el resultado del escaneo del código de barras
  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);

    // Extraemos el ID del QR, asumiendo el formato 'prod:<id>'
    const productId = data.replace('prod:', '');
    console.log("📌 QR escaneado, buscando ID:", productId);

    try {
      // Obtenemos los inventarios para encontrar el producto
      const inventories = await getInventories();
      const item = inventories.find((i: InventoryItem) => i._id === productId);

      if (!item) {
        Alert.alert('No encontrado', 'Producto no encontrado');
        setScanned(false); // Permite escanear de nuevo
        return;
      }

      // Navegamos a la pantalla de edición, pasando el ID como parámetro
      navigation.navigate('EditInventory', { itemId: item._id });

    } catch (err) {
      console.error("❌ Error al buscar producto:", err);
      Alert.alert('Error', 'No se pudo buscar el producto');
      setScanned(false);
    }
  };

  // Mensaje si no hay permisos de cámara
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  // Mensaje si se deniegan los permisos
  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text>No tienes acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button 
          title="Escanear otro QR" 
          onPress={() => setScanned(false)} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanQRCodeScreen;