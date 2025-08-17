// src/controllers/movementController.ts
import { Request, Response, NextFunction } from 'express';
import * as movementService from '../services/movementService';

// Controller para obtener los movimientos de un producto por su ID
export const getMovementsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const movements = await movementService.getMovementsByProduct(productId);
    res.json(movements);
  } catch (err: any) {
    next(err);
  }
};
