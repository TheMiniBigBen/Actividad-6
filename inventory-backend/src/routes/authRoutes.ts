import { Router } from 'express';
import { login, register, validateLogin, validateRegister } from '../controllers/authController';

const router = Router();
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
