import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  // deleteProduct,
  uploadExcelFile,

} from "../controllers/productController";
import { authenticateAdminToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getProducts);
router.post("/", authenticateAdminToken, createProduct);
router.put("/:id", authenticateAdminToken, updateProduct);
// router.delete("/:id", authenticateAdminToken, deleteProduct);
router.post("/upload", authenticateAdminToken, uploadExcelFile);
export default router;
