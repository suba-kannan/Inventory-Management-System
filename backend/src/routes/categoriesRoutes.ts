import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authenticateAdminToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllCategories);
router.post("/", authenticateAdminToken, createCategory);
router.put("/:id", authenticateAdminToken, updateCategory);
router.delete("/:id", authenticateAdminToken, deleteCategory);

export default router;
