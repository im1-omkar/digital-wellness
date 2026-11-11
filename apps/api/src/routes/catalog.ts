import { Router } from "express";
import { resourceFiltersSchema } from "@wellness/contracts";
import { compareResources, getGuide, getResource, listCategories, listGuides, listResources } from "../services/catalog.js";

export const catalogRouter = Router();

catalogRouter.get("/categories", async (_request, response) => {
  response.json({ data: await listCategories() });
});

catalogRouter.get("/resources", async (request, response) => {
  const parsed = resourceFiltersSchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({ error: { code: "INVALID_QUERY", message: "Check the search and filter values." } });
    return;
  }
  response.json(await listResources(parsed.data));
});

// Keep this fixed path above /resources/:slug so "compare" is not parsed as a resource slug.
catalogRouter.get("/resources/compare", async (request, response) => {
  const raw = typeof request.query.slugs === "string" ? request.query.slugs : "";
  const slugs = [...new Set(raw.split(",").map((slug) => slug.trim()).filter(Boolean))];
  if (slugs.length < 2 || slugs.length > 3) {
    response.status(400).json({ error: { code: "INVALID_COMPARISON", message: "Choose two or three resources to compare." } });
    return;
  }
  const data = await compareResources(slugs);
  if (data.length !== slugs.length) {
    response.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "One or more resources could not be found." } });
    return;
  }
  response.json({ data });
});

catalogRouter.get("/resources/:slug", async (request, response) => {
  const resource = await getResource(request.params.slug);
  if (!resource) {
    response.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "That resource could not be found." } });
    return;
  }
  response.json({ data: resource });
});

catalogRouter.get("/guides", async (request, response) => {
  const platform = typeof request.query.platform === "string" ? request.query.platform.trim() : undefined;
  const resource = typeof request.query.resource === "string" ? request.query.resource.trim() : undefined;
  response.json({ data: await listGuides(platform, resource) });
});

catalogRouter.get("/guides/:slug", async (request, response) => {
  const guide = await getGuide(request.params.slug);
  if (!guide) {
    response.status(404).json({ error: { code: "GUIDE_NOT_FOUND", message: "That setup guide could not be found." } });
    return;
  }
  response.json({ data: guide });
});
