import client from "prom-client";
import logger from "./logger.js";

client.collectDefaultMetrics();

logger.info("Custom metrics registration started");

let httpRequestDuration;
let httpRequestTotal;
let activeConnections;
let onlineUsers;
let messagesSent;
let authAttempts;
let dbOperationDuration;

try {
  httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  });
  logger.info("Metric created", { name: "http_request_duration_seconds" });
} catch (error) {
  logger.error("Failed to create metric", { name: "http_request_duration_seconds", error: error.message });
}

try {
  httpRequestTotal = new client.Counter({
    name: "http_request_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
  });
  logger.info("Metric created", { name: "http_request_total" });
} catch (error) {
  logger.error("Failed to create metric", { name: "http_request_total", error: error.message });
}

try {
  activeConnections = new client.Gauge({
    name: "active_connections",
    help: "Number of active socket connections",
  });
  logger.info("Metric created", { name: "active_connections" });
} catch (error) {
  logger.error("Failed to create metric", { name: "active_connections", error: error.message });
}

try {
  onlineUsers = new client.Gauge({
    name: "online_users_total",
    help: "Number of online users",
  });
  logger.info("Metric created", { name: "online_users_total" });
} catch (error) {
  logger.error("Failed to create metric", { name: "online_users_total", error: error.message });
}

try {
  messagesSent = new client.Counter({
    name: "messages_sent_total",
    help: "Total number of messages sent",
    labelNames: ["sender_id", "receiver_id"],
  });
  logger.info("Metric created", { name: "messages_sent_total" });
} catch (error) {
  logger.error("Failed to create metric", { name: "messages_sent_total", error: error.message });
}

try {
  authAttempts = new client.Counter({
    name: "auth_attempts_total",
    help: "Total number of authentication attempts",
    labelNames: ["type", "status"],
  });
  logger.info("Metric created", { name: "auth_attempts_total" });
} catch (error) {
  logger.error("Failed to create metric", { name: "auth_attempts_total", error: error.message });
}

try {
  dbOperationDuration = new client.Histogram({
    name: "db_operation_duration_seconds",
    help: "Duration of database operations in seconds",
    labelNames: ["operation"],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5],
  });
  logger.info("Metric created", { name: "db_operation_duration_seconds" });
} catch (error) {
  logger.error("Failed to create metric", { name: "db_operation_duration_seconds", error: error.message });
}

logger.info("Custom metrics registration finished", {
  metrics: client.register.getMetricsAsArray().map((m) => m.name),
});

export { httpRequestDuration, httpRequestTotal, activeConnections, onlineUsers, messagesSent, authAttempts, dbOperationDuration };

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    if (!httpRequestDuration || !httpRequestTotal) return;
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
    httpRequestTotal.inc({ method: req.method, route, status_code: res.statusCode });
  });

  next();
};
