import { Router } from "express";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController";
import { authenticateAdminToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllSuppliers);
router.post("/", authenticateAdminToken, createSupplier);
router.put("/:id", authenticateAdminToken, updateSupplier);
router.delete("/:id", authenticateAdminToken, deleteSupplier);

export default router;
