// src/services/inventoryService.ts
import api from './api';
import { InventoryItem, CreateInventoryItemRequest, UpdateInventoryItemRequest } from '../types';

/**
 * Fetches all inventory items from the server.
 */
export const getInventories = async (): Promise<InventoryItem[]> => {
  try {
    const response = await api.get('/inventories');
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

/**
 * Fetches a single inventory item by its ID.
 */
export const getInventoryById = async (id: string): Promise<InventoryItem> => {
    try {
        const response = await api.get(`/inventories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching inventory item with id ${id}:`, error);
        throw error;
    }
}

/**
 * Creates a new inventory item.
 */
export const createInventory = async (itemData: CreateInventoryItemRequest): Promise<InventoryItem> => {
    try {
        const response = await api.post('/inventories', itemData);
        return response.data;
    } catch (error) {
        console.error("Error creating inventory item:", error);
        throw error;
    }
}

/**
 * Updates an existing inventory item.
 */
export const updateInventory = async (id: string, updates: UpdateInventoryItemRequest): Promise<InventoryItem> => {
    try {
        const response = await api.put(`/inventories/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error(`Error updating inventory item with id ${id}:`, error);
        throw error;
    }
}

/**
 * Deletes an inventory item.
 */
export const deleteInventory = async (id: string): Promise<void> => {
    try {
        await api.delete(`/inventories/${id}`);
    } catch (error) {
        console.error(`Error deleting inventory item with id ${id}:`, error);
        throw error;
    }
}

/**
 * Fetches the complete action history for a product (created, updated, etc.).
 */
export const getProductHistory = async (productId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/inventories/${productId}/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product history:", error);
    return [];
  }
};

export const getDeletedProducts = async () => {
    try {
        const response = await api.get('/products/logs/deleted');
        return response.data;
    } catch (error) {
        console.error("Error fetching deleted products:", error);
        throw error;
    }
};
