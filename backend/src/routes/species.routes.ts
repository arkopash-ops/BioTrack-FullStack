import { Router } from "express";
import * as speciesController from "../controllers/species.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, speciesController._createSpecies);

export default router;
