import { Server } from "socket.io";
import http from "http";
import express from "express";
import { activeConnections, onlineUsers } from "./metrics.js";
import logger from "./logger.js";

const app = express();
const server = http.createServer(app);

const defaultOrigins = ["http://localhost:5173", "http://localhost:8080", "http://localhost"];
const envOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim()) : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  activeConnections.inc();
  logger.info("User connected", { socketId: socket.id });

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    onlineUsers.set(Object.keys(userSocketMap).length);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    activeConnections.dec();
    logger.info("User disconnected", { socketId: socket.id, userId });

    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    onlineUsers.set(Object.keys(userSocketMap).length);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
