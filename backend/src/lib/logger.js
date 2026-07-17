import os from "os";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "service", "hostname"],
  }),
  winston.format.json()
);

const fileTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  zippedArchive: true,
  format: logFormat,
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      ({ timestamp, level, message, service, hostname, ...meta }) => {
        let metaStr = "";

        if (Object.keys(meta).length > 0) {
          metaStr = `\n${JSON.stringify(meta, null, 2)}`;
        }

        return `${timestamp} [${level}] [${service}] [${hostname}]: ${message}${metaStr}`;
      }
    )
  ),
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",

  defaultMeta: {
    service: "backend",
    hostname: os.hostname(),
  },

  transports: [fileTransport, consoleTransport],

  exitOnError: false,
});

export default logger;