// src/controllers/productLogController.ts
import { Request, Response, NextFunction } from 'express';
import * as productLogService from '../services/productLogService';

export const getProductHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const history = await productLogService.getProductHistory(productId);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

export const getDeletedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProducts = await productLogService.getDeletedProducts();
    res.json(deletedProducts);
  } catch (err) {
    next(err);
  }
};