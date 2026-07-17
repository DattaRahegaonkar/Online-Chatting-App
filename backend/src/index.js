import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import { metricsMiddleware, activeConnections, onlineUsers } from "./lib/metrics.js";
import client from "prom-client";
import logger from "./lib/logger.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import healthRoutes from "./routes/health.route.js";
import { app, server, io } from "./lib/socket.js";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://localhost"],
    credentials: true,
  })
);

app.use(metricsMiddleware);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/health", healthRoutes);

app.get("/metrics", async (req, res) => {
  logger.info("Metrics endpoint hit");
  try {
    const payload = await client.register.metrics();
    const metricNames = client.register.getMetricsAsArray().map((m) => m.name);
    logger.info("Metrics generated", { length: payload.length, metrics: metricNames });
    res.set("Content-Type", client.register.contentType);
    res.end(payload);
  } catch (error) {
    logger.error("Failed to generate metrics", { error: error.message });
    res.status(500).json({ message: "Failed to generate metrics" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  logger.info("Server is running", { port: PORT });
  connectDB();
});
