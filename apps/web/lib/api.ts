import type { Category, Guide, Resource } from "@wellness/contracts";

const apiBase = (process.env.API_INTERNAL_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function fetchCategories(): Promise<Category[]> {
  const result = await apiGet<{ data: Category[] }>("/categories");
  return result.data;
}

export async function fetchResources(params: Record<string, string | undefined> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const query = search.size ? `?${search.toString()}` : "";
  return apiGet<{ items: Resource[]; total: number; limit: number; offset: number }>(`/resources${query}`);
}

export async function fetchResource(slug: string): Promise<Resource | null> {
  try {
    const result = await apiGet<{ data: Resource }>(`/resources/${encodeURIComponent(slug)}`);
    return result.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return null;
    throw error;
  }
}

export async function fetchComparison(slugs: string[]): Promise<Resource[]> {
  if (slugs.length < 2 || slugs.length > 3) return [];
  const search = new URLSearchParams({ slugs: slugs.join(",") });
  try {
    const result = await apiGet<{ data: Resource[] }>(`/resources/compare?${search.toString()}`);
    return result.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return [];
    throw error;
  }
}

export async function fetchGuides(params: Record<string, string | undefined> = {}): Promise<Guide[]> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const query = search.size ? `?${search.toString()}` : "";
  const result = await apiGet<{ data: Guide[] }>(`/guides${query}`);
  return result.data;
}

export async function fetchGuide(slug: string): Promise<Guide | null> {
  try {
    const result = await apiGet<{ data: Guide }>(`/guides/${encodeURIComponent(slug)}`);
    return result.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return null;
    throw error;
  }
}
