// src/services/movementService.ts
import { Movement, IMovement } from '../models/movementModel';

// Servicio para crear un nuevo movimiento
export const createMovement = async (data: Partial<IMovement>) => {
  return Movement.create(data);
};

// Servicio para obtener los movimientos de un producto por su ID
export const getMovementsByProduct = async (productId: string) => {
  // Busca todos los movimientos que coincidan con el productId y los ordena por fecha de manera descendente (-1)
  return Movement.find({ productId }).sort({ date: -1 });
};
