import mongoose from "mongoose";
import { dbOperationDuration } from "./metrics.js";
import logger from "./logger.js";

export const connectDB = async () => {
  const start = Date.now();
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const duration = (Date.now() - start) / 1000;
    dbOperationDuration.observe({ operation: "connect" }, duration);
    logger.info("MongoDB connected", { host: conn.connection.host, duration });
  } catch (error) {
    logger.error("MongoDB connection error", { error: error.message });
    process.exit(1);
  }
};
