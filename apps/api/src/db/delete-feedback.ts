import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, pool } from "./client.js";
import { feedback } from "./schema.js";

const id = process.argv[2];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

try {
  if (!id || !uuidPattern.test(id)) throw new Error("Pass a valid report UUID: npm run feedback:delete -w @wellness/api -- <uuid>");
  const removed = await db.delete(feedback).where(eq(feedback.id, id)).returning({ id: feedback.id });
  console.info(removed.length ? `Deleted feedback report ${id}.` : `No feedback report found for ${id}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not delete feedback report.");
  process.exitCode = 1;
} finally {
  await pool.end();
}
