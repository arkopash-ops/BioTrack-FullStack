import { Router } from "express";
import * as speciesController from "../controllers/species.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, speciesController._createSpecies);
router.get("/:slug", protect, speciesController._getSpecies);
router.get("/", protect, speciesController._getAllSpecies);
router.patch("/:slug", protect, speciesController._updateSpecies);

export default router;
