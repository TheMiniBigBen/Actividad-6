// src/routes/productLogRoutes.ts
import { Router } from 'express';
import { getProductHistory, getDeletedProducts } from '../controllers/productLogController';
import { auth } from '../middleware/auth';

const router = Router();

// Rutas para el historial de productos
router.get('/history/:productId', auth, getProductHistory);
router.get('/deleted', auth, getDeletedProducts);

export default router;