import { and, asc, eq, inArray } from "drizzle-orm";
import type { Category, Guide, Resource, ResourceFilters } from "@wellness/contracts";
import { db } from "../db/client.js";
import { categories, guideSources, guideSteps, guides, resourceSources, resources } from "../db/schema.js";

async function readResources(): Promise<Resource[]> {
  const rows = await db
    .select({ resource: resources, category: categories, source: resourceSources })
    .from(resources)
    .innerJoin(categories, eq(resources.categoryId, categories.id))
    .leftJoin(resourceSources, eq(resourceSources.resourceId, resources.id))
    .where(eq(resources.status, "published"))
    .orderBy(asc(categories.sortOrder), asc(resources.name));

  const grouped = new Map<string, Resource>();
  for (const row of rows) {
    const existing = grouped.get(row.resource.id);
    if (existing) {
      if (row.source) existing.sources.push({
        url: row.source.url,
        label: row.source.label,
        sourceType: row.source.sourceType,
        checkedAt: row.source.checkedAt
      });
      continue;
    }

    grouped.set(row.resource.id, {
      id: row.resource.id,
      slug: row.resource.slug,
      name: row.resource.name,
      category: { slug: row.category.slug, name: row.category.name },
      purpose: row.resource.purpose,
      bestFor: row.resource.bestFor,
      goalTags: row.resource.goalTags,
      platforms: row.resource.platforms,
      costLabel: row.resource.costLabel,
      costDetails: row.resource.costDetails,
      accountRequirements: row.resource.accountRequirements,
      privacyNotes: row.resource.privacyNotes,
      accessibilityNotes: row.resource.accessibilityNotes,
      limitations: row.resource.limitations,
      quickStart: row.resource.quickStart,
      lastVerifiedAt: row.resource.lastVerifiedAt,
      sources: row.source ? [{
        url: row.source.url,
        label: row.source.label,
        sourceType: row.source.sourceType,
        checkedAt: row.source.checkedAt
      }] : []
    });
  }
  return [...grouped.values()];
}

export async function listResources(filters: ResourceFilters) {
  const all = await readResources();
  const query = filters.q?.toLocaleLowerCase();
  const filtered = all.filter((resource) => {
    if (filters.category && resource.category.slug !== filters.category) return false;
    if (filters.platform && !resource.platforms.some((platform) => platform.toLocaleLowerCase().includes(filters.platform!.toLocaleLowerCase()))) return false;
    if (filters.cost && resource.costLabel !== filters.cost) return false;
    if (filters.goal && !resource.goalTags.includes(filters.goal.toLocaleLowerCase())) return false;
    if (query && ![
      resource.name,
      resource.purpose,
      resource.bestFor,
      resource.costDetails,
      resource.accountRequirements,
      resource.privacyNotes,
      resource.accessibilityNotes,
      resource.limitations,
      resource.category.name,
      ...resource.platforms,
      ...resource.goalTags
    ].join(" ").toLocaleLowerCase().includes(query)) return false;
    return true;
  });

  return {
    items: filtered.slice(filters.offset, filters.offset + filters.limit),
    total: filtered.length,
    limit: filters.limit,
    offset: filters.offset
  };
}

export async function getResource(slug: string): Promise<Resource | null> {
  const all = await readResources();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function compareResources(slugs: string[]): Promise<Resource[]> {
  const all = await readResources();
  const bySlug = new Map(all.map((resource) => [resource.slug, resource]));
  return slugs.map((slug) => bySlug.get(slug)).filter((item): item is Resource => Boolean(item));
}

export async function listCategories(): Promise<Category[]> {
  const [categoryRows, resourceRows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select({ categoryId: resources.categoryId }).from(resources).where(eq(resources.status, "published"))
  ]);
  const counts = new Map<string, number>();
  for (const resource of resourceRows) counts.set(resource.categoryId, (counts.get(resource.categoryId) ?? 0) + 1);
  return categoryRows.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    count: counts.get(category.id) ?? 0
  }));
}

async function readGuides(): Promise<Guide[]> {
  const guideRows = await db
    .select({ guide: guides, resource: resources })
    .from(guides)
    .leftJoin(resources, eq(guides.resourceId, resources.id))
    .where(eq(guides.status, "published"))
    .orderBy(asc(guides.title));
  const ids = guideRows.map((row) => row.guide.id);
  if (!ids.length) return [];

  const [stepRows, sourceRows] = await Promise.all([
    db.select().from(guideSteps).where(inArray(guideSteps.guideId, ids)).orderBy(asc(guideSteps.position)),
    db.select().from(guideSources).where(inArray(guideSources.guideId, ids)).orderBy(asc(guideSources.label))
  ]);

  return guideRows.map(({ guide, resource }) => ({
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    platform: guide.platform,
    versionContext: guide.versionContext,
    intro: guide.intro,
    prerequisites: guide.prerequisites,
    undoSteps: guide.undoSteps,
    troubleshooting: guide.troubleshooting,
    imagePath: guide.imagePath,
    imageAlt: guide.imageAlt,
    lastVerifiedAt: guide.lastVerifiedAt,
    resource: resource ? { slug: resource.slug, name: resource.name } : null,
    steps: stepRows.filter((step) => step.guideId === guide.id).map((step) => ({
      position: step.position,
      title: step.title,
      instruction: step.instruction,
      ...(step.note ? { note: step.note } : {})
    })),
    sources: sourceRows.filter((source) => source.guideId === guide.id).map((source) => ({
      url: source.url,
      label: source.label,
      sourceType: source.sourceType,
      checkedAt: source.checkedAt
    }))
  }));
}

export async function listGuides(platform?: string, resourceSlug?: string): Promise<Guide[]> {
  let items = await readGuides();
  if (platform) items = items.filter((guide) => guide.platform.toLocaleLowerCase().includes(platform.toLocaleLowerCase()));
  if (resourceSlug) items = items.filter((guide) => guide.resource?.slug === resourceSlug);
  return items;
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const items = await readGuides();
  return items.find((guide) => guide.slug === slug) ?? null;
}

export async function getResourceId(slug: string) {
  const [resource] = await db.select({ id: resources.id }).from(resources)
    .where(and(eq(resources.slug, slug), eq(resources.status, "published"))).limit(1);
  return resource?.id ?? null;
}

export async function getGuideId(slug: string) {
  const [guide] = await db.select({ id: guides.id }).from(guides)
    .where(and(eq(guides.slug, slug), eq(guides.status, "published"))).limit(1);
  return guide?.id ?? null;
}
