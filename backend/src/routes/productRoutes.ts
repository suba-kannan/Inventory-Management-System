import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  uploadExcelFile,

} from "../controllers/productController";
import { authenticateAdminToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getProducts);
router.post("/", authenticateAdminToken, createProduct);
router.put("/:id", authenticateAdminToken, updateProduct);
router.post("/upload", authenticateAdminToken, uploadExcelFile);
export default router;
