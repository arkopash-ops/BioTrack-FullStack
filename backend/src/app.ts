import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import logger from "./middlewares/logger.middleware";

import authRoutes from "./routes/auth.routes";
import { errorLogger } from "./middlewares/error.middleware";

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);

app.use(errorLogger);

export default app;
