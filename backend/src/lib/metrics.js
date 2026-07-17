import client from "prom-client";
import logger from "./logger.js";

client.collectDefaultMetrics();

logger.info("Custom metrics registration started");

let httpRequestDuration;
let httpRequestTotal;
let totalHttpRequests;
let httpErrors;
let activeConnections;
let onlineUsers;
let messagesSent;
let authAttempts;
let dbOperationDuration;
let totalRegisteredUsers;
let failedLoginAttempts;
let successfulLogins;
let userRegistrations;
let activeChatRooms;
let applicationMemoryUsage;

const activeConversationIds = new Set();

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
  totalHttpRequests = new client.Counter({
    name: "total_http_requests",
    help: "Total number of HTTP requests",
  });
  logger.info("Metric created", { name: "total_http_requests" });
} catch (error) {
  logger.error("Failed to create metric", { name: "total_http_requests", error: error.message });
}

try {
  httpErrors = new client.Counter({
    name: "http_errors_total",
    help: "Total number of HTTP error responses",
    labelNames: ["status_code"],
  });
  logger.info("Metric created", { name: "http_errors_total" });
} catch (error) {
  logger.error("Failed to create metric", { name: "http_errors_total", error: error.message });
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

try {
  totalRegisteredUsers = new client.Counter({
    name: "total_registered_users",
    help: "Total number of registered users",
  });
  logger.info("Metric created", { name: "total_registered_users" });
} catch (error) {
  logger.error("Failed to create metric", { name: "total_registered_users", error: error.message });
}

try {
  failedLoginAttempts = new client.Counter({
    name: "failed_login_attempts",
    help: "Total number of failed login attempts",
  });
  logger.info("Metric created", { name: "failed_login_attempts" });
} catch (error) {
  logger.error("Failed to create metric", { name: "failed_login_attempts", error: error.message });
}

try {
  successfulLogins = new client.Counter({
    name: "successful_logins",
    help: "Total number of successful logins",
  });
  logger.info("Metric created", { name: "successful_logins" });
} catch (error) {
  logger.error("Failed to create metric", { name: "successful_logins", error: error.message });
}

try {
  userRegistrations = new client.Counter({
    name: "user_registrations",
    help: "Total number of user registrations",
  });
  logger.info("Metric created", { name: "user_registrations" });
} catch (error) {
  logger.error("Failed to create metric", { name: "user_registrations", error: error.message });
}

try {
  activeChatRooms = new client.Gauge({
    name: "active_chat_rooms",
    help: "Number of active chat rooms (distinct user conversations)",
  });
  logger.info("Metric created", { name: "active_chat_rooms" });
} catch (error) {
  logger.error("Failed to create metric", { name: "active_chat_rooms", error: error.message });
}

try {
  applicationMemoryUsage = new client.Gauge({
    name: "application_memory_usage_bytes",
    help: "Application memory usage in bytes",
  });
  logger.info("Metric created", { name: "application_memory_usage_bytes" });
} catch (error) {
  logger.error("Failed to create metric", { name: "application_memory_usage_bytes", error: error.message });
}

setInterval(() => {
  if (applicationMemoryUsage && process.memoryUsage) {
    applicationMemoryUsage.set(process.memoryUsage().rss);
  }
}, 15000);
if (applicationMemoryUsage && process.memoryUsage) {
  applicationMemoryUsage.set(process.memoryUsage().rss);
}

logger.info("Custom metrics registration finished", {
  metrics: client.register.getMetricsAsArray().map((m) => m.name),
});

export {
  httpRequestDuration,
  httpRequestTotal,
  totalHttpRequests,
  httpErrors,
  activeConnections,
  onlineUsers,
  messagesSent,
  authAttempts,
  dbOperationDuration,
  totalRegisteredUsers,
  failedLoginAttempts,
  successfulLogins,
  userRegistrations,
  activeChatRooms,
  applicationMemoryUsage,
  activeConversationIds,
};

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
    if (totalHttpRequests) {
      totalHttpRequests.inc();
    }
    if (httpErrors && res.statusCode >= 400) {
      httpErrors.inc({ status_code: res.statusCode });
    }
  });

  next();
};
