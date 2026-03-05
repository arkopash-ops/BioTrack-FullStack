import { Router } from "express";
import { _register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", _register);

export default router;