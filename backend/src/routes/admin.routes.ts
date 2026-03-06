import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import authorizedRole from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";

const router = Router();

router.get("/allProfiles", protect, authorizedRole(Roles.ADMIN), adminController._getAllUsers);
router.get("/:ID", protect, authorizedRole(Roles.ADMIN), adminController._getUserByID);
router.put("/:ID", protect, authorizedRole(Roles.ADMIN), adminController._updateUserByID);
router.delete("/:ID", protect, authorizedRole(Roles.ADMIN), adminController._deleteUserByID);

export default router;
