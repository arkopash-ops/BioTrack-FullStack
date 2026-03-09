import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorizedRole } from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";

const router = Router();

router.get("/me", protect, profileController._getMyProfile);
router.put("/me", protect, profileController._updateMyProfile);
router.delete("/me", protect, profileController._deleteMyProfile);

router.post(
    "/me/request-researcher",
    protect,
    authorizedRole(Roles.VISITOR),
    profileController._requestResearcher
);

export default router;
