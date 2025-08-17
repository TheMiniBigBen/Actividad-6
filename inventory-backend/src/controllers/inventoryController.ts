// src/controllers/inventoryController.ts
import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as inventoryService from '../services/inventoryService';
import * as logService from '../services/productLogService'; // Import the log service

// Controller to create an inventory item
export const createInventory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const doc = await inventoryService.createInventory(req.body);
    res.status(201).json(doc);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all inventory items
export const getInventories = async (_req: Request, res: Response) => {
  try {
    const items = await inventoryService.getInventories();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get an inventory item by ID
export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const item = await inventoryService.getInventoryById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update an inventory item
export const updateInventory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedItem = await inventoryService.updateInventory(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete an inventory item
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const deletedItem = await inventoryService.deleteInventory(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- NUEVA FUNCIÓN ---
// Controller to get the history of a product
export const getProductHistory = async (req: Request, res: Response) => {
  try {
    const history = await logService.getProductHistory(req.params.id);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching product history", details: error.message });
  }
};


// --- VALIDACIONES (para que el archivo esté completo) ---
export const validateCreate = [
  body('name').notEmpty().withMessage('Name is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
];

export const validateUpdate = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('quantity').optional().isNumeric().withMessage('Quantity must be a number'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
];

export const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];