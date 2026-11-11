import { Router } from "express";
import { feedbackSchema } from "@wellness/contracts";
import { db } from "../db/client.js";
import { feedback } from "../db/schema.js";
import { getGuideId, getResourceId } from "../services/catalog.js";

export const feedbackRouter = Router();

feedbackRouter.post("/feedback", async (request, response) => {
  const parsed = feedbackSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: { code: "INVALID_FEEDBACK", message: "Choose a target and issue type, then enter a message between 5 and 1000 characters." } });
    return;
  }

  const [resourceId, guideId] = await Promise.all([
    parsed.data.resourceSlug ? getResourceId(parsed.data.resourceSlug) : Promise.resolve(null),
    parsed.data.guideSlug ? getGuideId(parsed.data.guideSlug) : Promise.resolve(null)
  ]);
  if ((parsed.data.resourceSlug && !resourceId) || (parsed.data.guideSlug && !guideId)) {
    response.status(404).json({ error: { code: "TARGET_NOT_FOUND", message: "The selected resource or guide could not be found." } });
    return;
  }

  await db.insert(feedback).values({
    resourceId,
    guideId,
    issueType: parsed.data.issueType,
    message: parsed.data.message
  });

  response.status(201).json({ data: { accepted: true } });
});
