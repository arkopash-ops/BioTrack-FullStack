import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", protect, profileController._getMyProfile);
router.put("/me", protect, profileController._updateMyProfile);
router.delete("/me", protect, profileController._deleteMyProfile);

export default router;
