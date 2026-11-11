import "dotenv/config";
import { eq } from "drizzle-orm";
import { guideSchema, resourceSchema } from "@wellness/contracts";
import { categorySeeds, guideSeeds, resourceSeeds } from "@wellness/content";
import { db, pool } from "./client.js";
import { categories, guideSources, guideSteps, guides, resourceSources, resources } from "./schema.js";

async function seed() {
  for (const resource of resourceSeeds) resourceSchema.parse(resource);
  for (const guide of guideSeeds) {
    const resource = resourceSeeds.find((item) => item.slug === guide.resourceSlug);
    if (!resource) throw new Error(`Missing guide resource: ${guide.resourceSlug}`);
    guideSchema.parse({ ...guide, id: "seed", resource: { slug: resource.slug, name: resource.name } });
  }

  await db.transaction(async (tx) => {
    for (const category of categorySeeds) {
      await tx.insert(categories).values(category).onConflictDoUpdate({
        target: categories.slug,
        set: { name: category.name, description: category.description, sortOrder: category.sortOrder }
      });
    }

    const categoryRows = await tx.select().from(categories);
    const categoryIdBySlug = new Map(categoryRows.map((row) => [row.slug, row.id]));
    const resourceIdBySlug = new Map<string, string>();

    for (const item of resourceSeeds) {
      const categoryId = categoryIdBySlug.get(item.category.slug);
      if (!categoryId) throw new Error(`Missing category: ${item.category.slug}`);
      const { category, sources, id: _seedId, ...content } = item;
      const values = { ...content, categoryId, status: "published" as const, updatedAt: new Date() };
      const [saved] = await tx.insert(resources).values(values).onConflictDoUpdate({
        target: resources.slug,
        set: { ...values, slug: item.slug }
      }).returning({ id: resources.id, slug: resources.slug });
      if (!saved) throw new Error(`Could not save resource: ${item.slug}`);
      resourceIdBySlug.set(saved.slug, saved.id);

      await tx.delete(resourceSources).where(eq(resourceSources.resourceId, saved.id));
      if (sources.length) {
        await tx.insert(resourceSources).values(sources.map((entry) => ({
          resourceId: saved.id,
          url: entry.url,
          label: entry.label,
          sourceType: entry.sourceType,
          checkedAt: entry.checkedAt
        })));
      }
    }

    for (const item of guideSeeds) {
      const resourceId = resourceIdBySlug.get(item.resourceSlug);
      if (!resourceId) throw new Error(`Missing guide resource: ${item.resourceSlug}`);
      const { resourceSlug, sources, steps, ...content } = item;
      const values = { ...content, resourceId, status: "published" as const, updatedAt: new Date() };
      const [saved] = await tx.insert(guides).values(values).onConflictDoUpdate({
        target: guides.slug,
        set: { ...values, slug: item.slug }
      }).returning({ id: guides.id, slug: guides.slug });
      if (!saved) throw new Error(`Could not save guide: ${item.slug}`);

      await tx.delete(guideSteps).where(eq(guideSteps.guideId, saved.id));
      if (steps.length) {
        await tx.insert(guideSteps).values(steps.map((step) => ({
          guideId: saved.id,
          position: step.position,
          title: step.title,
          instruction: step.instruction,
          note: step.note ?? null
        })));
      }

      await tx.delete(guideSources).where(eq(guideSources.guideId, saved.id));
      if (sources.length) {
        await tx.insert(guideSources).values(sources.map((entry) => ({
          guideId: saved.id,
          url: entry.url,
          label: entry.label,
          sourceType: entry.sourceType,
          checkedAt: entry.checkedAt
        })));
      }
    }
  });

  console.info(`Seeded ${resourceSeeds.length} resources, ${categorySeeds.length} categories, and ${guideSeeds.length} guides.`);
}

seed().catch((error: unknown) => {
  console.error("Catalog seed failed.", error);
  process.exitCode = 1;
}).finally(async () => {
  await pool.end();
});
