// src/services/movementService.ts
import api from './api';
import { Movement } from '../types';

/**
 * Fetches movement history for a specific product.
 */
export const getMovementsByProduct = async (productId: string): Promise<Movement[]> => {
  try {
    const res = await api.get(`/movements/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    throw error;
  }
};

/**
 * Creates a new movement record.
 */
export const createMovement = async (data: Partial<Movement>) => {
  try {
    const res = await api.post('/movements', data);
    return res.data;
  } catch (error) {
    console.error('Error creating movement:', error);
    throw error;
  }
};