import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { logger } from "./middlewares/logger.middleware";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import adminRoutes from "./routes/admin.routes";
import taxonomyRoutes from "./routes/taxonomy.routes";
import speciesRoutes from "./routes/species.routes";

import { errorLogger } from "./middlewares/error.middleware";
import path from "path";

const app = express();

//middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(logger);

// images from Public
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/taxonomy", taxonomyRoutes);
app.use("/api/species", speciesRoutes);

app.use(errorLogger);

export default app;
