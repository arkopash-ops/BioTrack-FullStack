import { Router } from "express";
import { _getMyProfile } from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/profile/me
router.get("/me", protect, _getMyProfile);

export default router;
