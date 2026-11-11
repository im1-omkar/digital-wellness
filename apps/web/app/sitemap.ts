import type { MetadataRoute } from "next";
import { fetchGuides, fetchResources } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [{ items: resources }, guides] = await Promise.all([
    fetchResources({ limit: "100" }),
    fetchGuides()
  ]);
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resources`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/guides`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/methodology`, changeFrequency: "yearly", priority: 0.5 },
    ...resources.map((resource) => ({ url: `${base}/resources/${resource.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.7 }))
  ];
}
