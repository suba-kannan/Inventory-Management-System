import { Router } from "express";
import {
  createOrder,
  cancelOrder,
  getOrders,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController";
import { authenticateToken, authenticateAdminToken } from "../middleware/authMiddleware";
const router = Router();

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getOrders);
router.delete("/:id", authenticateToken, cancelOrder);
router.get('/user', authenticateToken, getOrdersByUser);
router.get("/all", authenticateAdminToken, getAllOrders);
router.put("/status/:id", authenticateAdminToken, updateOrderStatus);

export default router;
