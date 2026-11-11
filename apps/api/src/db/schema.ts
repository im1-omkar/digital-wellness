import {
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const costLabelEnum = pgEnum("cost_label", ["built_in", "free", "freemium", "paid", "open_source"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);
export const sourceTypeEnum = pgEnum("source_type", ["product", "support", "pricing", "privacy", "license"]);
export const feedbackTypeEnum = pgEnum("feedback_type", ["broken_link", "outdated", "unclear", "accessibility", "other"]);
export const feedbackReviewStatusEnum = pgEnum("feedback_review_status", ["new", "reviewed", "resolved", "deleted"]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  purpose: text("purpose").notNull(),
  bestFor: text("best_for").notNull(),
  goalTags: jsonb("goal_tags").$type<string[]>().notNull().default([]),
  platforms: jsonb("platforms").$type<string[]>().notNull().default([]),
  costLabel: costLabelEnum("cost_label").notNull(),
  costDetails: text("cost_details").notNull(),
  accountRequirements: text("account_requirements").notNull(),
  privacyNotes: text("privacy_notes").notNull(),
  accessibilityNotes: text("accessibility_notes").notNull(),
  limitations: text("limitations").notNull(),
  quickStart: text("quick_start").notNull(),
  status: contentStatusEnum("status").notNull().default("draft"),
  lastVerifiedAt: date("last_verified_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("resources_category_status_idx").on(table.categoryId, table.status),
  index("resources_cost_status_idx").on(table.costLabel, table.status)
]);

export const resourceSources = pgTable("resource_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  resourceId: uuid("resource_id").notNull().references(() => resources.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  label: varchar("label", { length: 220 }).notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  checkedAt: date("checked_at", { mode: "string" }).notNull()
}, (table) => [index("resource_sources_resource_idx").on(table.resourceId)]);

export const guides = pgTable("guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  summary: text("summary").notNull(),
  platform: varchar("platform", { length: 120 }).notNull(),
  versionContext: text("version_context").notNull(),
  intro: text("intro").notNull(),
  prerequisites: jsonb("prerequisites").$type<string[]>().notNull().default([]),
  undoSteps: text("undo_steps").notNull(),
  troubleshooting: text("troubleshooting").notNull(),
  imagePath: text("image_path").notNull(),
  imageAlt: text("image_alt").notNull(),
  resourceId: uuid("resource_id").references(() => resources.id, { onDelete: "set null" }),
  status: contentStatusEnum("status").notNull().default("draft"),
  lastVerifiedAt: date("last_verified_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [index("guides_status_idx").on(table.status)]);

export const guideSteps = pgTable("guide_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  guideId: uuid("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  instruction: text("instruction").notNull(),
  note: text("note")
}, (table) => [
  uniqueIndex("guide_steps_position_unique").on(table.guideId, table.position),
  index("guide_steps_guide_idx").on(table.guideId)
]);

export const guideSources = pgTable("guide_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  guideId: uuid("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  label: varchar("label", { length: 220 }).notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  checkedAt: date("checked_at", { mode: "string" }).notNull()
}, (table) => [index("guide_sources_guide_idx").on(table.guideId)]);

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  resourceId: uuid("resource_id").references(() => resources.id, { onDelete: "set null" }),
  guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
  issueType: feedbackTypeEnum("issue_type").notNull(),
  message: varchar("message", { length: 1000 }).notNull(),
  reviewStatus: feedbackReviewStatusEnum("review_status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true })
}, (table) => [
  check("feedback_has_target_check", sql`${table.resourceId} is not null or ${table.guideId} is not null`),
  index("feedback_review_status_idx").on(table.reviewStatus, table.createdAt)
]);

export const schema = { categories, resources, resourceSources, guides, guideSteps, guideSources, feedback };
