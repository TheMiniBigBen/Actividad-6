// src/services/productLogService.ts
import { ProductLog, IProductLog } from '../models/productLogModel';

// Servicio para registrar una acción en el historial de un producto
export const logProductAction = async (productId: string, action: IProductLog['action'], details: any) => {
  return ProductLog.create({
    productId,
    action,
    details,
  });
};

// Servicio para obtener el historial completo de un producto
export const getProductHistory = async (productId: string) => {
  return ProductLog.find({ productId }).sort({ timestamp: -1 });
};

// Servicio para obtener el historial de productos eliminados
export const getDeletedProducts = async () => {
  return ProductLog.find({ action: 'deleted' }).sort({ timestamp: -1 });
};