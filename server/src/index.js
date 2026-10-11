import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
