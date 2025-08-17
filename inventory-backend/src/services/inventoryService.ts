// src/services/inventoryService.ts
import { Inventory, IInventory } from "../models/inventoryModel";
import QRCode from "qrcode";
import { createMovement } from './movementService';
import { logProductAction } from "./productLogService";

// Service to update the quantity of an inventory item
export const updateInventoryQuantity = async (id: string, newQty: number, type: 'in' | 'out') => {
  const inventory = await Inventory.findById(id);
  if (!inventory) {
    throw new Error('Inventory item not found');
  }

  const oldQty = inventory.quantity;
  const quantityChange = Math.abs(newQty - oldQty);

  const updatedInventory = await Inventory.findByIdAndUpdate(id, { quantity: newQty }, { new: true });
  
  if (updatedInventory && quantityChange > 0) {
    const movementType = newQty > oldQty ? 'in' : 'out';
    await createMovement({ 
      productId: id, 
      quantity: quantityChange, 
      type: movementType 
    });
    
    // This adds the action to the general product history log
    await logProductAction(id, 'quantity_change', { newQuantity: newQty, type: movementType });
  }

  return updatedInventory;
};

// Service to create a new inventory item
export const createInventory = async (data: IInventory) => {
  if (!data.qrCode) {
    const payload = { name: data.name, category: data.category };
    data.qrCode = await QRCode.toDataURL(JSON.stringify(payload));
  }
  const doc = await Inventory.create(data);

  if (!doc.qrCode) {
    const payload = { id: doc._id.toString(), name: doc.name };
    doc.qrCode = await QRCode.toDataURL(JSON.stringify(payload));
    await doc.save();
  }
  
  // Log the 'created' action
  await logProductAction(doc._id.toString(), 'created', { createdWith: data });

  // Agrega este registro de movimiento para la creación inicial
  if (doc.quantity > 0) {
      await createMovement({
          productId: doc._id.toString(),
          type: 'in',
          quantity: doc.quantity,
      });
  }

  return doc;
};

// Service to get all inventory items
export const getInventories = async () => Inventory.find().sort({ name: 1 });

// Service to get low-stock items
export const getLowStock = async (threshold: number) => {
  return Inventory.find({ quantity: { $lte: threshold } }).sort({ quantity: 1, name: 1 });
};

// Service to get an inventory item by its ID
export const getInventoryById = async (id: string) => Inventory.findById(id);

// Servicio para actualizar un item del inventario
export const updateInventory = async (id: string, data: Partial<IInventory>) => {
    const oldDoc = await Inventory.findById(id);
    if (!oldDoc) {
        throw new Error('Inventory item not found');
    }

    const updatedDoc = await Inventory.findByIdAndUpdate(id, data, { new: true });

    if (!updatedDoc) {
        throw new Error('Inventory item not found after update attempt');
    }

    // Registra la acción de 'updated' con todos los cambios
    await logProductAction(id, 'updated', { changes: data, oldQuantity: oldDoc.quantity });
    
    // Comprueba si la cantidad ha cambiado y crea un movimiento
    if (data.quantity !== undefined && data.quantity !== oldDoc.quantity) {
        const quantityChange = data.quantity - oldDoc.quantity;
        const type = quantityChange > 0 ? 'in' : 'out';
        
        await createMovement({
            productId: id,
            type: type,
            quantity: Math.abs(quantityChange),
        });
    }

    return updatedDoc;
};

// Servicio para eliminar un item del inventario (CORREGIDO)
export const deleteInventory = async (id:string) => {
    const deletedDoc = await Inventory.findByIdAndDelete(id);

    // Si se encontró el documento, lo registramos como eliminado en el historial
    if(deletedDoc) {
        await logProductAction(id, 'deleted', { deletedProduct: deletedDoc });
    }
    return deletedDoc;
};