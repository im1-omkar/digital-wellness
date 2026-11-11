import { lt } from "drizzle-orm";
import { db } from "./client.js";
import { feedback } from "./schema.js";

const MAX_AGE_DAYS = 90;

export async function purgeExpiredFeedback() {
  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  const deleted = await db.delete(feedback).where(lt(feedback.createdAt, cutoff)).returning({ id: feedback.id });
  if (deleted.length) console.info(`Removed ${deleted.length} feedback report(s) older than ${MAX_AGE_DAYS} days.`);
}
