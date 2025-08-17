// src/routes/inventoryRoutes.ts
import { Router } from "express";
import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  validateCreate,
  validateId,
  validateUpdate,
  getProductHistory, // <-- Import the new controller
} from "../controllers/inventoryController";
import { auth } from "../middleware/auth";
import * as service from "../services/inventoryService";

const router = Router();

router.use(auth); // All routes require authentication

router.post("/", validateCreate, createInventory);
router.get("/", getInventories);

router.get("/low-stock/:threshold", async (req, res) => {
  const n = parseInt(req.params.threshold || "5", 10);
  const items = await service.getLowStock(n);
  res.json(items);
});

router.get("/:id", validateId, getInventoryById);

// --- NUEVA RUTA ---
// This route will fetch the action history for a specific product
router.get("/:id/history", validateId, getProductHistory);

router.put("/:id", validateUpdate, updateInventory);
router.delete("/:id", validateId, deleteInventory);

export const setInventoryRoutes = (app: any) => {
  app.use("/api/inventories", router);
};

export default router;