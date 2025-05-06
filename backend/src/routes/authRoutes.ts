import { Router } from 'express';
import cors from 'cors';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.use(cors({ origin: "http://localhost:5173", credentials: true }));

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;

