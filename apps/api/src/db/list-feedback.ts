import "dotenv/config";
import { desc } from "drizzle-orm";
import { db, pool } from "./client.js";
import { feedback } from "./schema.js";

try {
  const reports = await db.select({
    id: feedback.id,
    createdAt: feedback.createdAt,
    issueType: feedback.issueType,
    resourceId: feedback.resourceId,
    guideId: feedback.guideId,
    message: feedback.message
  }).from(feedback).orderBy(desc(feedback.createdAt)).limit(100);
  // This private maintainer command is the only built-in way to view report text.
  console.table(reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString() })));
} catch (error) {
  console.error("Could not list feedback reports.", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  await pool.end();
}
