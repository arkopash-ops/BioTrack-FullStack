import { Router } from "express";
import * as taxonomyController from "../controllers/taxonomy.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorizedRole } from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";

const router = Router();

router.post(
    "/",
    protect,
    authorizedRole(Roles.RESEARCHER),
    taxonomyController._createTaxonomy

);

router.get(
    "/",
    protect,
    taxonomyController._getAllTaxonomy

);

router.put(
    "/:slug",
    protect,
    authorizedRole(Roles.RESEARCHER),
    taxonomyController._updateTaxonomy

);

router.get(
    "/:slug",
    protect,
    taxonomyController._getTaxonomy
);

export default router;
