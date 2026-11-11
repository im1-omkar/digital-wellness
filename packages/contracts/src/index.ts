import { z } from "zod";

export const costLabels = ["built_in", "free", "freemium", "paid", "open_source"] as const;
export const issueTypes = ["broken_link", "outdated", "unclear", "accessibility", "other"] as const;

export const resourceSourceSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  label: z.string(),
  sourceType: z.enum(["product", "support", "pricing", "privacy", "license"]),
  checkedAt: z.string()
});

export const resourceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.object({ slug: z.string(), name: z.string() }),
  purpose: z.string(),
  bestFor: z.string(),
  goalTags: z.array(z.string()),
  platforms: z.array(z.string()),
  costLabel: z.enum(costLabels),
  costDetails: z.string(),
  accountRequirements: z.string(),
  privacyNotes: z.string(),
  accessibilityNotes: z.string(),
  limitations: z.string(),
  quickStart: z.string(),
  lastVerifiedAt: z.string(),
  sources: z.array(resourceSourceSchema)
});

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  count: z.number().int().nonnegative()
});

export const guideStepSchema = z.object({
  position: z.number().int().positive(),
  title: z.string(),
  instruction: z.string(),
  note: z.string().optional()
});

export const guideSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  platform: z.string(),
  versionContext: z.string(),
  intro: z.string(),
  prerequisites: z.array(z.string()),
  undoSteps: z.string(),
  troubleshooting: z.string(),
  imagePath: z.string(),
  imageAlt: z.string(),
  lastVerifiedAt: z.string(),
  sources: z.array(resourceSourceSchema),
  resource: z.object({ slug: z.string(), name: z.string() }).nullable(),
  steps: z.array(guideStepSchema)
});

export const resourceFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
  platform: z.string().trim().max(80).optional(),
  cost: z.enum(costLabels).optional(),
  goal: z.string().trim().max(80).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).max(10000).default(0)
});

export const feedbackSchema = z.object({
  resourceSlug: z.string().trim().max(100).optional(),
  guideSlug: z.string().trim().max(100).optional(),
  issueType: z.enum(issueTypes),
  message: z.string().trim().min(5).max(1000)
}).refine((value) => Boolean(value.resourceSlug || value.guideSlug), {
  message: "Choose the resource or guide this feedback is about."
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceSource = z.infer<typeof resourceSourceSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Guide = z.infer<typeof guideSchema>;
export type GuideStep = z.infer<typeof guideStepSchema>;
export type ResourceFilters = z.infer<typeof resourceFiltersSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
