import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../controllers/userController';
import { authenticateAdminToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateAdminToken, getAllUsers);
router.post('/', authenticateAdminToken, createUser);
router.put('/:id', authenticateAdminToken, updateUser);
router.delete('/:id', authenticateAdminToken, deleteUser);

export default router;
