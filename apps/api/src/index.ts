import "dotenv/config";
import { app } from "./app.js";
import { pool } from "./db/client.js";
import { purgeExpiredFeedback } from "./db/retention.js";

const port = Number(process.env.PORT || 4000);
const server = app.listen(port, "0.0.0.0", () => {
  console.info(`Digital Wellness API listening on port ${port}.`);
});

void purgeExpiredFeedback().catch((error: unknown) => {
  console.error("Feedback retention cleanup failed.", error instanceof Error ? error.message : "Unknown error");
});
const retentionTimer = setInterval(() => {
  void purgeExpiredFeedback().catch((error: unknown) => {
    console.error("Feedback retention cleanup failed.", error instanceof Error ? error.message : "Unknown error");
  });
}, 24 * 60 * 60 * 1000);
retentionTimer.unref();

async function shutdown(signal: string) {
  console.info(`${signal} received; closing API connections.`);
  clearInterval(retentionTimer);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
