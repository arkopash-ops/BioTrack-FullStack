import { Router } from "express";
import * as speciesController from "../controllers/species.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorizedRole } from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";

const router = Router();

router.post(
    "/",
    protect,
    authorizedRole(Roles.RESEARCHER),
    speciesController._createSpecies
);

router.get(
    "/:slug",
    protect,
    speciesController._getSpecies
);

router.get(
    "/",
    protect,
    speciesController._getAllSpecies
);

router.patch(
    "/:slug",
    protect,
    authorizedRole(Roles.RESEARCHER),
    speciesController._updateSpecies
);

router.get(
    "/tree/:slug",
    protect,
    speciesController._getSpeciesTree
);

export default router;
