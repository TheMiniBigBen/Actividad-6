import { Router } from 'express';
import { getMovementsByProduct } from '../controllers/movementController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/:productId', auth, getMovementsByProduct);

export default router;
