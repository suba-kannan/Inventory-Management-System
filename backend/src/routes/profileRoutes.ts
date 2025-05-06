import { Router } from "express";
import { editProfile, getProfile } from "../controllers/ProfileController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getProfile);
router.put("/", authenticateToken, editProfile);

export default router;
