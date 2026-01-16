import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import authRouter from "./routers/auth.router.js";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router.js";
import templateRouter from "./routers/template.router.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

// Allow CORS from local dev frontends (handles varying dev ports like 5173/5174/5175)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      // Allow any localhost origin (http) for development
      if (origin.startsWith("http://localhost")) return callback(null, true);
      // Fallback: allow if matches env CLIENT_URL
      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/template", templateRouter);

// Serve uploads directory
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  connectDB();
  console.log(`Server Running at ${port}`);
});
