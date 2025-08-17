// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanQRCodeScreen from './scr/screens/ScanQRCodeScreen';
import LoginScreen from './scr/screens/LoginScreen';
import InventoryScreen from './scr/screens/InventoryScreen';
import CreateInventoryScreen from './scr/screens/CreateInventoryScreen';
import EditInventoryScreen from './scr/screens/EditInventoryScreen';
import DashboardScreen from './scr/screens/DashboardScreen';
import ProductHistoryScreen from './scr/screens/ProductHistoryScreen';
import RegisterScreen from './scr/screens/RegisterScreen';
import DeletedProductsScreen from './scr/screens/DeletedProductsScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, title: 'Crear Cuenta' }} />
        <Stack.Screen name="ScanQRCode" component={ScanQRCodeScreen} options={{ title: 'Escanear QR' }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventario' }} />
        <Stack.Screen name="CreateInventory" component={CreateInventoryScreen} options={{ title: 'Crear Producto' }} />
        <Stack.Screen name="EditInventory" component={EditInventoryScreen} options={{ title: 'Editar Producto' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="ProductHistory" component={ProductHistoryScreen} options={{ title: 'Historial de Producto' }} />
        <Stack.Screen name="DeletedProducts" component={DeletedProductsScreen} options={{ title: 'Productos Eliminados' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
