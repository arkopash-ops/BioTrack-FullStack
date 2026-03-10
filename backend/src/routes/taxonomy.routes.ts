import { Router } from "express";
import * as taxonomyController from "../controllers/taxonomy.controller"
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, taxonomyController._createTaxonomy);
router.get("/", protect, taxonomyController._getAllTaxonomy);
router.put("/:id", protect, taxonomyController._updateTaxonomy);

export default router;
