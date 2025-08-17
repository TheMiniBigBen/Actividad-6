// src/types.ts

// A product in the inventory
export interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  category: string;
  qrCode?: string;
}

// Data to create a new product
export interface CreateInventoryItemRequest {
  name: string;
  quantity: number;
  category: string;
  qrCode?: string;
}

// Data to update a product
export interface UpdateInventoryItemRequest {
  name?: string;
  quantity?: number;
  category?: string;
  qrCode?: string;
}

// Interface for inventory movements
export interface Movement {
  _id: string;
  productId: string;
  quantity: number;
  type: 'in' | 'out';
  date: string;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
// Authenticated user information
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}