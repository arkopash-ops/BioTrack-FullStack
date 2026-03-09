import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorizedRole } from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// for Researcher Requests

router.get(
    "/researcher-requests",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._getAllResearcherRequests
);

router.post(
    "/researcher-requests/:ID/approve",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._approveResearcher
);

router.post(
    "/researcher-requests/:ID/reject",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._rejectResearcher
);

// ----------------------------------------------------------------------------------------------------

// for Users and Profiles

router.get(
    "/allProfiles",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._getAllUsers
);

router.get(
    "/:ID",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._getUserByID
);

router.put(
    "/:ID",
    protect,
    authorizedRole(Roles.ADMIN),
    upload.single("profileImage"),
    adminController._updateUserByID
);

router.delete(
    "/:ID",
    protect,
    authorizedRole(Roles.ADMIN),
    adminController._deleteUserByID
);

export default router;
