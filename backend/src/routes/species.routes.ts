import { Router } from "express";
import * as speciesController from "../controllers/species.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorizedRole } from "../middlewares/role.middleware";
import { Roles } from "../types/users.types";
import { uploadSpeciesImages } from "../middlewares/uploadSpeciesImages.middleware";

const router = Router();

router.get(
    "/public",
    speciesController._getPublicSpeciesList
);

// image
router.post(
    "/:slug/images",
    protect,
    uploadSpeciesImages.array("images", 5),
    speciesController._uploadSpeciesImages
);

router.delete(
    "/:slug/images",
    protect,
    speciesController._deleteSpeciesImage
);
//


router.get(
    "/search",
    protect,
    speciesController._searchSpecies
);

router.get(
    "/filter",
    protect,
    speciesController._filterSpecies
);

router.get(
    "/map",
    protect,
    speciesController._getSpeciesMap
);

router.get(
    "/:slug/location",
    protect,
    speciesController._getSpeciesHabitat
);

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

router.get(
    "/:slug/related",
    protect,
    speciesController._getRelatedSpecies
);

router.patch(
    "/:slug",
    protect,
    authorizedRole(Roles.RESEARCHER),
    speciesController._updateSpecies
);

router.patch(
    "/:slug/habitat",
    protect,
    authorizedRole(Roles.RESEARCHER),
    speciesController._updateSpeciesHabitat
);

router.delete(
    "/:slug",
    protect,
    authorizedRole(Roles.RESEARCHER),
    speciesController._deleteSpecies
);

router.get(
    "/tree/:slug",
    protect,
    speciesController._getSpeciesTree
);

router.get(
    "/map/search",
    protect,
    speciesController._groupSpeciesForMap
);



export default router;
