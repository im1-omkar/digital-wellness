import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { catalogRouter } from "./routes/catalog.js";
import { feedbackRouter } from "./routes/feedback.js";
import { pool } from "./db/client.js";

export const app = express();
app.disable("x-powered-by");
const trustedProxyHops = Number(process.env.TRUST_PROXY || 0);
if (Number.isInteger(trustedProxyHops) && trustedProxyHops > 0) app.set("trust proxy", trustedProxyHops);
app.use(helmet());
app.use(cors({
  origin: (process.env.WEB_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim()),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.post("/api/v1/feedback", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Please wait a while before sending another report." } }
}));
app.use(express.json({ limit: "10kb", type: "application/json" }));

app.get("/health", async (_request, response) => {
  await pool.query("select 1");
  response.json({ status: "ok" });
});

app.use("/api/v1", catalogRouter);
app.use("/api/v1", feedbackRouter);

app.use((_request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "The requested endpoint does not exist." } });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  // Keep request bodies and database details out of logs and client responses.
  const errorCode = typeof error === "object" && error !== null && "type" in error ? String(error.type) : "";
  const errorStatus = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 500;
  if (errorStatus >= 500) console.error("API request failed.");
  if (response.headersSent) return;
  if (errorCode === "entity.too.large") {
    response.status(413).json({ error: { code: "PAYLOAD_TOO_LARGE", message: "That request is too large." } });
    return;
  }
  if (errorStatus === 400) {
    response.status(400).json({ error: { code: "INVALID_REQUEST", message: "Enter a valid JSON request." } });
    return;
  }
  response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } });
};
app.use(errorHandler);
